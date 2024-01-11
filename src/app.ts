import express, {Application} from "express";
import compression from "compression";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import IController from "./utils/interfaces/controller.interface";
import ErrorMiddleWare from "./middleware/error/error.middleware";
import apiKeyMiddleware from "./middleware/auth/api.key.middleware";
import { connectToDB } from "./database/connecttodb";
import { checkTokenAndDecode } from "./middleware/auth/protected.api.middleware";
import path from 'path';
import { checkUserStatus } from "./middleware/auth/statusMiddleware";
//import { connectToDB } from "./database/connecttodb";


class App {
	public express: Application;
	public publicPath = path.join(__dirname, '..', '..', 'public');

	constructor(controller: IController[]){
		this.express = express();

		this.initializeDBConnection();
		this.initializeMiddleWare();
		this.initializeControllers(controller);
		this.initializeErrorhandling();
	}
	private initializeMiddleWare(){
		
		this.express.use(cors());
		this.express.use(helmet());
		this.express.use(morgan("dev"));
		this.express.use(compression());
		this.express.use(checkTokenAndDecode);
		// Increase payload size limit
		this.express.use(express.json({limit: '50mb' }));
		this.express.use(express.static(this.publicPath));
		this.express.use(express.urlencoded({limit: '50mb', extended: true}));
		this.express.use(apiKeyMiddleware);
	}
	private initializeControllers(controllers:IController[]){
		controllers.forEach(controller=>{
			if(controller.path === "auth"){
				this.express.use(`/api/${controller.path}`, controller.router)
			  }else{
				this.express.use(`/api/${controller.path}`, checkUserStatus, controller.router)
			  }
		});
	}

	private initializeErrorhandling():void{
		this.express.use(ErrorMiddleWare);
	}

	 private initializeDBConnection():void{
	
		const connect =	Promise.resolve(connectToDB()).then(res=>{
			if(res.isHealthy()){
				console.log("Database connection successful")
			}else{
				console.log("Database connection failed")
			}
		}).catch(err=>console.log(err));
		
	}
}

export default App;
import { connectToDB } from "../../database/connecttodb";
import shell from 'shelljs';
import OracleDB from "oracledb"
import env from "../../utils/validateEnv";
import path from 'path';


class SettingsRepository{

async performRmanBackup() {
  let connection =  await connectToDB();

  try {
     // Set the directory where the backup file will be saved
  const backupDestination = path.join(__dirname, '..', '..', '..', 'public', 'backups', 'backup.sql'); 

  // Set the name for the backup file (customize the filename as needed)
  const backupFileName = `backup_${new Date().toISOString().replace(/[-T:]/g, '_')}`;

  // RMAN backup command to be executed
//  const rmanCommand = `
  // RUN {
  //   ALLOCATE CHANNEL c1 DEVICE TYPE DISK FORMAT ${backupDestination};
  //   BACKUP DATABASE PLUS ARCHIVELOG;
  //   SQL 'ALTER SYSTEM ARCHIVE LOG CURRENT';
  //   RELEASE CHANNEL c1;
  // }
  // `;

  const rmanCommand = `rman target=${env.DB_USERNAME}/${env.DB_PASSWORD}@${env.DB_URI} BACKUP DATABASE;
`;

   const execProcess = shell.exec(rmanCommand, {async:true}, function(error, stdout, stderr) {
        if (error !== 0) {
      console.error(`Error during backup`);
      return {status:400, error:"Error during backup"};
    }
    if (stderr) {
      console.error(`Backup process encountered an error: ${stderr}`);
      return {status:400, error:stderr};
    }
    console.log(`Backup process completed successfully: ${stdout}`);
    return {status:200, error:stdout};
  });

      
  } catch (error:any) {
      console.log(error);
      return {status:400, error:error.message};
  } finally{
      if (connection) {
          try {
            await connection.close();
          } catch (err) {
            console.error('Error closing connection:', err);
          }
        }
  }

}
}

export default new SettingsRepository()

Argument     Value          Description
-----------------------------------------------------------------------------
target       quoted-string  connect-string for target database
catalog      quoted-string  connect-string for recovery catalog
auxiliary    quoted-string  connect-string for auxiliary database
nocatalog    none           if specified, then no recovery catalog
cmdfile      quoted-string  name of input command file
log          quoted-string  name of output message log file
trace        quoted-string  name of output debugging message log file
append       none           if specified, log is opened in append mode
debug        optional-args  activate debugging
msgno        none           show RMAN-nnnn prefix for all messages
send         quoted-string  send a command to the media manager
pipe         string         building block for pipe names
script       string         name of catalog script to execute
using        list of args   arguments for rman variables
timeout      integer        number of seconds to wait for pipe input
checksyntax  none           check the command file for syntax errors
-----------------------------------------------------------------------------
Both single and double quotes (' or ") are accepted for a quoted-string.
Quotes are not required unless the string contains embedded white-space.

RMAN-00571: ===========================================================
RMAN-00569: =============== ERROR MESSAGE STACK FOLLOWS ===============
RMAN-00571: ===========================================================
RMAN-00552: syntax error in command line arguments
RMAN-01009: syntax error: found "identifier": expecting one of: "append, auxiliary, catalog, checksyntax, cmdfile, log, msgno, nocatalog, pipe, script, send, target, timeout, using, @, ;"
RMAN-01008: the bad identifier was: AHQMS
RMAN-01007: at line 2 column 1 file: command line arguments

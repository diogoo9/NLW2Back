## crating file of configurations ts

$yarn tsc --init

## change tsconfig target:"es2017" - porque o node não entende algumas coisas das versões mais recentes


## reload automático
- $ yarn add ts-node-dev -D 
- $ yarn 


## lib ultilizadas
- sqlite(banco de dados relacional)
- knex(query builder)


## funcionalidade 
  ### conexões
  - total de conexões realizadas
  - criar uma nova conexão 
  
  ## Aulas 
  - criar aula
  - listar aulas 
   - filtrar por: matéria, dia da semana, e horário


   ## how to run app
   $ yarn start 

   ## migrations 
   $ yarn knex:migrate

   ## migrate rollback 
   $ yarn knex:migrate:rollback

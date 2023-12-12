1. Create a database called 'movies' in MySQL
2. Run assignment_data/movies.sql and assignment_data/user_and_tokens.sql to create tables
3. Update database connection information in .env file
3. npm i 
4. npm run start
5. http://localhost:3000

firebase emulators:start
install rabbitmq: 
docker run -d --name rabbit -e RABBITMQ_DEFAULT_USER=admin -e RABBITMQ_DEFAULT_PASS=admin -p 15672:15672 -p 5672:5672 -p 25672:25672 -p 61613:61613 -p 1883:1883 rabbitmq:management
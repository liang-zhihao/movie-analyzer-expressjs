# Backend Application Test Plan

**Human:**
 

***

**Assistant:**

Here is a test plan for the backend application using Node, Express, node-MySQL2, Swagger, Knex, JSON Web Tokens, and ES6 with module. The test plan is based on the requirements you provided:
<table><thead><tr><th>Test Case ID</th><th>Description</th><th>HTTP Method</th><th>Endpoint</th><th>Request</th><th>Expected Status Code</th><th>Expected Response</th></tr></thead><tbody><tr><td>1</td><td>User Registration with Valid Data</td><td>POST</td><td>/user/register</td><td>{"email":"<a href="mailto:test@user.com" target="_new">test@user.com</a>","password":"testPassword"}</td><td>200</td><td>{"message": "User created"}</td></tr><tr><td>2</td><td>User Registration with Existing Email</td><td>POST</td><td>/user/register</td><td>{"email":"<a href="mailto:test@user.com" target="_new">test@user.com</a>","password":"testPassword"}</td><td>400</td><td>{ "error": true, "message": "Email already exists" }</td></tr><tr><td>3</td><td>User Registration with Invalid Email Format</td><td>POST</td><td>/user/register</td><td>{"email":"invalidEmail","password":"testPassword"}</td><td>400</td><td>{ "error": true, "message": "Invalid email format" }</td></tr><tr><td>4</td><td>User Registration with Missing Password</td><td>POST</td><td>/user/register</td><td>{"email":"<a href="mailto:test@user2.com" target="_new">test@user2.com</a>"}</td><td>400</td><td>{ "error": true, "message": "Missing required field: password" }</td></tr><tr><td>5</td><td>User Registration with Missing Email</td><td>POST</td><td>/user/register</td><td>{"password":"testPassword"}</td><td>400</td><td>{ "error": true, "message": "Missing required field: email" }</td></tr><tr><td>6</td><td>User Login with Valid Credentials</td><td>POST</td><td>/user/login</td><td>{"email":"<a href="mailto:test@user.com" target="_new">test@user.com</a>","password":"testPassword"}</td><td>200</td><td>{"bearerToken": { "token": "&lt;&lt;some token here&gt;&gt;", "token_type": "Bearer", "expires_in": 600},"refreshToken": { "token": "&lt;&lt;some other token here&gt;&gt;", "token_type": "Refresh", "expires_in": 86400 }}</td></tr><tr><td>7</td><td>User Login with Invalid Password</td><td>POST</td><td>/user/login</td><td>{"email":"<a href="mailto:test@user.com" target="_new">test@user.com</a>","password":"wrongPassword"}</td><td>401</td><td>{"error": true,"message": "Invalid password"}</td></tr><tr><td>8</td><td>User Login with Non-existing Email</td><td>POST</td><td>/user/login</td><td>{"email":"<a href="mailto:nonexist@user.com" target="_new">nonexist@user.com</a>","password":"testPassword"}</td><td>404</td><td>{"error": true,"message": "User not found"}</td></tr><tr><td>9</td><td>Token Refresh with Valid Refresh Token</td><td>POST</td><td>/user/refresh</td><td>{"refreshToken":"&lt;&lt;valid refresh token&gt;&gt;"}</td><td>200</td><td>{"bearerToken": { "token": "&lt;&lt;some token here&gt;&gt;", "token_type": "Bearer", "expires_in": 600},"refreshToken": { "token": "&lt;&lt;some other token here&gt;&gt;", "token_type": "Refresh", "expires_in": 86400 }}</td></tr><tr><td>10</td><td>Token Refresh with Expired Refresh Token</td><td>POST</td><td>/user/refresh</td><td>{"refreshToken":"&lt;&lt;expired refresh token&gt;&gt;"}</td><td>401</td><td>{"error": true,"message": "JWT token has expired"}</td></tr><tr><td>11</td><td>User Logout with Valid Refresh Token</td><td>POST</td><td>/user/logout</td><td>{"refreshToken":"&lt;&lt;valid refresh token&gt;&gt;"}</td><td>200</td><td>{"error": false,"message": "Token successfully invalidated"}</td></tr><tr><td>12</td><td>User Logout with Expired Refresh Token</td><td>POST</td><td>/user/logout</td><td>{"refreshToken":"&lt;&lt;expired refresh token&gt;&gt;"}</td><td>401</td><td>{"error": true,"message": "JWT token has expired"}</td></tr><tr><td>13</td><td>Get User Profile with Valid JWT</td><td>GET</td><td>/user/{email}/profile</td><td>Header: {"Authorization": "Bearer &lt;&lt;valid JWT&gt;&gt;"}</td><td>200</td><td>{"email": "<a href="mailto:test@user.com" target="_new">test@user.com</a>", "firstName": "Test", "lastName": "User", "dob": "&lt;&lt;DOB&gt;&gt;", "address": "&lt;&lt;Address&gt;&gt;"}</td></tr><tr><td>14</td><td>Get User Profile without JWT</td><td>GET</td><td>/user/{email}/profile</td><td></td><td>200</td><td>{"email": "<a href="mailto:test@user.com" target="_new">test@user.com</a>", "firstName": "Test", "lastName": "User"}</td></tr><tr><td>15</td><td>Get Non-existing User Profile</td><td>GET</td><td>/user/nonexist@user.com/profile</td><td>Header: {"Authorization": "Bearer &lt;&lt;valid JWT&gt;&gt;"}</td><td>404</td><td>{"error": true,"message": "User not found"}</td></tr><tr><td>16</td><td>Get User Profile with Expired JWT</td><td>GET</td><td>/user/{email}/profile</td><td>Header: {"Authorization": "Bearer &lt;&lt;expired JWT&gt;&gt;"}</td><td>401</td><td>{"error": true,"message": "JWT token has expired"}</td></tr><tr><td>17</td><td>Get User Profile with Invalid JWT</td><td>GET</td><td>/user/{email}/profile</td><td>Header: {"Authorization": "Bearer &lt;&lt;invalid JWT&gt;&gt;"}</td><td>401</td><td>{"error": true,"message": "Invalid JWT token"}</td></tr><tr><td>18</td><td>Update User Profile with Valid Data</td><td>PUT</td><td>/user/{email}/profile</td><td>Header: {"Authorization": "Bearer &lt;&lt;valid JWT&gt;&gt;"}, Body: {"firstName": "Updated","lastName": "User","dob": "&lt;&lt;New DOB&gt;&gt;","address": "&lt;&lt;New Address&gt;&gt;"}</td><td>200</td><td>{"email": "<a href="mailto:test@user.com" target="_new">test@user.com</a>","firstName": "Updated","lastName": "User","dob": "&lt;&lt;New DOB&gt;&gt;","address": "&lt;&lt;New Address&gt;&gt;"}</td></tr><tr><td>19</td><td>Update User Profile without JWT</td><td>PUT</td><td>/user/{email}/profile</td><td>Body: {"firstName": "Updated","lastName": "User","dob": "&lt;&lt;New DOB&gt;&gt;","address": "&lt;&lt;New Address&gt;&gt;"}</td><td>401</td><td>{"error": true,"message": "Authorization header ('Bearer token') not found"}</td></tr><tr><td>20</td><td>Update User Profile with Expired JWT</td><td>PUT</td><td>/user/{email}/profile</td><td>Header: {"Authorization": "Bearer &lt;&lt;expired JWT&gt;&gt;"}, Body: {"firstName": "Updated","lastName": "User","dob": "&lt;&lt;New DOB&gt;&gt;","address": "&lt;&lt;New Address&gt;&gt;"}</td><td>401</td><td>{"error": true,"message": "JWT token has expired"}</td></tr><tr><td>21</td><td>Update User Profile with Invalid JWT</td><td>PUT</td><td>/user/{email}/profile</td><td>Header: {"Authorization": "Bearer &lt;&lt;invalid JWT&gt;&gt;"}, Body: {"firstName": "Updated","lastName": "User","dob": "&lt;&lt;New DOB&gt;&gt;","address": "&lt;&lt;New Address&gt;&gt;"}</td><td>401</td><td>{"error": true,"message": "Invalid JWT token"}</td></tr><tr><td>22</td><td>Update User Profile with Wrong Email in JWT</td><td>PUT</td><td>/user/other@user.com/profile</td><td>Header: {"Authorization": "Bearer &lt;&lt;valid JWT&gt;&gt;"}, Body: {"firstName": "Updated","lastName": "User","dob": "&lt;&lt;New DOB&gt;&gt;","address": "&lt;&lt;New Address&gt;&gt;"}</td><td>403</td><td>{"error": true,"message": "Forbidden"}</td></tr><tr><td>23</td><td>Update User Profile with Missing Fields</td><td>PUT</td><td>/user/{email}/profile</td><td>Header: {"Authorization": "Bearer &lt;&lt;valid JWT&gt;&gt;"}, Body: {"firstName": "Updated"}</td><td>400</td><td>{"error": true,"message": "Request body incomplete: firstName, lastName, dob and address are required"}</td></tr><tr><td>24</td><td>Update User Profile with Non-string Fields</td><td>PUT</td><td>/user/{email}/profile</td><td>Header: {"Authorization": "Bearer &lt;&lt;valid JWT&gt;&gt;"}, Body: {"firstName": 123,"lastName": "User","dob": "&lt;&lt;New DOB&gt;&gt;","address": "&lt;&lt;New Address&gt;&gt;"}</td><td>400</td><td>{"error": true,"message": "Request body invalid: firstName, lastName, dob and address must be strings only"}</td></tr><tr><td>25</td><td>Update User Profile with Invalid DOB</td><td>PUT</td><td>/user/{email}/profile</td><td>Header: {"Authorization": "Bearer &lt;&lt;valid JWT&gt;&gt;"}, Body: {"firstName": "Updated","lastName": "User","dob": "30-02-2020","address": "&lt;&lt;New Address&gt;&gt;"}</td><td>400</td><td>{"error": true,"message": "Invalid input: dob must be a real date in format YYYY-MM-DD"}</td></tr><tr><td>26</td><td>Update Non-existing User Profile</td><td>PUT</td><td>/user/nonexist@user.com/profile</td><td>Header: {"Authorization": "Bearer &lt;&lt;valid JWT&gt;&gt;"}, Body: {"firstName": "Updated","lastName": "User","dob": "&lt;&lt;New DOB&gt;&gt;","address": "&lt;&lt;New Address&gt;&gt;"}</td><td>404</td><td>{"error": true,"message": "User not found"}</td></tr><tr><td>27</td><td>Logout without Refresh Token</td><td>POST</td><td>/user/logout</td><td>Body: {}</td><td>401</td><td>{"error": true, "message": "JWT token has expired"}</td></tr><tr><td>28</td><td>Logout with Invalid Refresh Token</td><td>POST</td><td>/user/logout</td><td>Body: {"refreshToken": "&lt;&lt;invalid Refresh Token&gt;&gt;"}</td><td>401</td><td>{"error": true, "message": "JWT token has expired"}</td></tr><tr><td>29</td><td>Logout with Expired Refresh Token</td><td>POST</td><td>/user/logout</td><td>Body: {"refreshToken": "&lt;&lt;expired Refresh Token&gt;&gt;"}</td><td>401</td><td>{"error": true, "message": "JWT token has expired"}</td></tr><tr><td>30</td><td>Successful Logout</td><td>POST</td><td>/user/logout</td><td>Body: {"refreshToken": "&lt;&lt;valid Refresh Token&gt;&gt;"}</td><td>200</td><td>{"error": false, "message": "Token successfully invalidated"}</td></tr></tbody></table>

***

**Human:**
 
***

**Assistant:**

Here's a testing plan for the three endpoints provided above:
<table><thead><tr><th>Test Case ID</th><th>Test Case</th><th>HTTP Method</th><th>Endpoint</th><th>Header</th><th>Parameters/Body</th><th>Expected HTTP Status</th><th>Expected Response</th></tr></thead><tbody><tr><td>1</td><td>Search for Movies with Title</td><td>GET</td><td>/movies/search</td><td></td><td>{ "title": "Star Trek"}</td><td>200</td><td>JSON response with movies titled "Star Trek"</td></tr><tr><td>2</td><td>Search for Movies with Year</td><td>GET</td><td>/movies/search</td><td></td><td>{ "year": 2001 }</td><td>200</td><td>JSON response with movies from the year 2001</td></tr><tr><td>3</td><td>Search for Movies with Pagination</td><td>GET</td><td>/movies/search</td><td></td><td>{ "page": 2 }</td><td>200</td><td>JSON response with second page of movies</td></tr><tr><td>4</td><td>Search for Movies with Nonexistent Title</td><td>GET</td><td>/movies/search</td><td></td><td>{ "title": "Nonexistent Movie" }</td><td>200</td><td>JSON response with empty data</td></tr><tr><td>5</td><td>Search for Movies without Parameters</td><td>GET</td><td>/movies/search</td><td></td><td></td><td>200</td><td>JSON response with movies</td></tr><tr><td>6</td><td>Get Movie Data with Valid IMDb ID</td><td>GET</td><td>/movies/data/{imdbID}</td><td></td><td>{ "imdbID": "tt0111280" }</td><td>200</td><td>JSON response with data for the movie with the given IMDb ID</td></tr><tr><td>7</td><td>Get Movie Data with Invalid IMDb ID</td><td>GET</td><td>/movies/data/{imdbID}</td><td></td><td>{ "imdbID": "InvalidID" }</td><td>404</td><td>JSON response with error message</td></tr><tr><td>8</td><td>Get Movie Data without IMDb ID</td><td>GET</td><td>/movies/data/{imdbID}</td><td></td><td></td><td>400</td><td>JSON response with error message</td></tr><tr><td>9</td><td>Get Person with Valid ID</td><td>GET</td><td>/people/{id}</td><td></td><td>{ "id": "nm0000095" }</td><td>200</td><td>JSON response with data for the person with the given ID</td></tr><tr><td>10</td><td>Get Person with Invalid ID</td><td>GET</td><td>/people/{id}</td><td></td><td>{ "id": "InvalidID" }</td><td>404</td><td>JSON response with error message</td></tr><tr><td>11</td><td>Get Person without ID</td><td>GET</td><td>/people/{id}</td><td></td><td></td><td>400</td><td>JSON response with error message</td></tr><tr><td>12</td><td>Search for Movies with Title and Year</td><td>GET</td><td>/movies/search</td><td></td><td>{ "title": "Star Trek", "year": 2001 }</td><td>200</td><td>JSON response with movies titled "Star Trek" from the year 2001</td></tr><tr><td>13</td><td>Search for Movies with Invalid Year</td><td>GET</td><td>/movies/search</td><td></td><td>{ "year": "InvalidYear" }</td><td>400</td><td>JSON response with error message</td></tr><tr><td>14</td><td>Search for Movies with Negative Page Number</td><td>GET</td><td>/movies/search</td><td></td><td>{ "page": -1 }</td><td>400</td><td>JSON response with error message</td></tr><tr><td>15</td><td>Search for Movies with Nonexistent Page</td><td>GET</td><td>/movies/search</td><td></td><td>{ "page": 9999999 }</td><td>200</td><td>JSON response with empty data</td></tr></tbody></table>
Remember that the exact nature of the error messages and HTTP status codes will depend on how your server is set up to handle these situations.


***

**Human:**
more 10

***

**Assistant:**

Sure, here are 10 more test cases:
<table><thead><tr><th>Test Case ID</th><th>Test Case</th><th>HTTP Method</th><th>Endpoint</th><th>Header</th><th>Parameters/Body</th><th>Expected HTTP Status</th><th>Expected Response</th></tr></thead><tbody><tr><td>16</td><td>Get Movie Data for a Movie without Ratings</td><td>GET</td><td>/movies/data/{imdbID}</td><td></td><td>{ "imdbID": "tt0111280" }</td><td>200</td><td>JSON response with data for the movie with the given IMDb ID, ratings field should be null or empty</td></tr><tr><td>17</td><td>Get Movie Data for a Movie without Boxoffice</td><td>GET</td><td>/movies/data/{imdbID}</td><td></td><td>{ "imdbID": "tt0111280" }</td><td>200</td><td>JSON response with data for the movie with the given IMDb ID, boxoffice field should be null</td></tr><tr><td>18</td><td>Get Person with Roles in No Movies</td><td>GET</td><td>/people/{id}</td><td></td><td>{ "id": "nm0000095" }</td><td>200</td><td>JSON response with data for the person with the given ID, roles field should be null or empty</td></tr><tr><td>19</td><td>Get Movie Data with Invalid Header</td><td>GET</td><td>/movies/data/{imdbID}</td><td>InvalidHeader</td><td>{ "imdbID": "tt0111280" }</td><td>400</td><td>JSON response with error message</td></tr><tr><td>20</td><td>Get Person with Invalid Header</td><td>GET</td><td>/people/{id}</td><td>InvalidHeader</td><td>{ "id": "nm0000095" }</td><td>400</td><td>JSON response with error message</td></tr><tr><td>21</td><td>Search for Movies with Title, Year and Page</td><td>GET</td><td>/movies/search</td><td></td><td>{ "title": "Star Trek", "year": 2001, "page": 2 }</td><td>200</td><td>JSON response with second page of movies titled "Star Trek" from the year 2001</td></tr><tr><td>22</td><td>Get Movie Data for a Movie with No Poster</td><td>GET</td><td>/movies/data/{imdbID}</td><td></td><td>{ "imdbID": "tt0111280" }</td><td>200</td><td>JSON response with data for the movie with the given IMDb ID, poster field should be null</td></tr><tr><td>23</td><td>Get Person who is Deceased</td><td>GET</td><td>/people/{id}</td><td></td><td>{ "id": "nm0000095" }</td><td>200</td><td>JSON response with data for the person with the given ID, deathYear field should not be null</td></tr><tr><td>24</td><td>Get Movie Data for a Movie with No Plot</td><td>GET</td><td>/movies/data/{imdbID}</td><td></td><td>{ "imdbID": "tt0111280" }</td><td>200</td><td>JSON response with data for the movie with the given IMDb ID, plot field should be null</td></tr><tr><td>25</td><td>Search for Movies with Invalid Parameters</td><td>GET</td><td>/movies/search</td><td></td><td>{ "invalidParameter": "invalid" }</td><td>400</td><td>JSON response with error message</td></tr></tbody></table>
Again, the exact nature of the error messages and HTTP status codes will depend on how your server is set up to handle these situations.


***

Exported on May 28, 2023 7:45 PM.
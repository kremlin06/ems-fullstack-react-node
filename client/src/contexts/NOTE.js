/*
look, i get it. auth is confusing the first time. 
here's the mental model:

1. user types creds → frontend sends to backend
2. backend checks creds → if good, returns jwt token
3. frontend stores token → attaches to every future request
4. backend verifies token on each request → lets you in or kicks you out
5. token expires → frontend uses refresh token to get new one (seamless)
6. refresh fails → frontend logs user out, sends back to login

that's it. everything else is just ui polish and error handling.

common pitfalls:
- forgetting to attach token to requests (use the axios interceptor, dummy)
- storing tokens in localStorage and wondering why xss is a concern (it is)
- not handling token expiry (users get logged out randomly, they hate that)
- showing "invalid username" vs "invalid password" (helps attackers, don't do it)
- console.logging passwords (i'm watching you, remove that)

if you break something:
1. check the network tab in devtools
2. look at the request headers for Authorization: Bearer <token>
3. verify the token is actually there and not "undefined" or "Bearer undefined"
4. if backend says 401, token is expired or invalid, check refresh logic
5. if still stuck, console.log everything. shamelessly. then remove before commit.

you got this. now go ship it.

last note: if a comment doesn't make sense, it's probably because i wrote it while tired. 
ask in the team chat in Telegram, don't just guess. guessing is how we get production bugs at 2am.
*/


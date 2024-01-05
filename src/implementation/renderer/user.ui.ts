import { Role, UserPayload } from "../../core/entities/user"

export const usersList = (users: UserPayload[]) => {
  let html: string = `<h1>Lista Utenti</h1>
  <table><thead><tr><th>Nome</th><th>Email</th><th>Ruolo</th></tr></thead><tbody>`
  users.forEach(user => {
      html += `<tr>`
      html += `<td>${user.fullname}</td><td>${user.email}</td><td>${Object.entries(Role)[user.role]}</td>`
      html += `</tr>`
  })
  return html+=`</tbody></table>`
}

export const loginForm = () => `
  <h1>Login</h1>
  <form method="post"
    hx-post="/auth/login"
    hx-ext="json-enc"
    hx-target="#content"
    hx-trigger="submit"
    >
      <input type="text" name="email" placeholder="username" />
      <input type="password" name="password" placeholder="password" />
      <button type="submit">Login</button>
  </form>
`
export const userInfo = (user: UserPayload) => `
  <div id="userinfo">Benvenuto, ${user.fullname} - <a href="#" hx-target="#content" hx-get="/api/auth/logout">Logout</a></div>
`
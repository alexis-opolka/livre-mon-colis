import style from "@/app/page.module.sass";

export default function livreMonColis(){

  return(
    <>
      <header className={style.Header}> Livre Mon Colis</header>

      <main className={style.Section}>
        <nav className={style.Section}>
          <a href="http://localhost:3000/user"> Register user</a>
          <a href="http://localhost:3000/user/login"> Login user</a>
          <a href="http://localhost:3000/packages"> Access packages dashboard (only as Seller)</a>
        </nav>
      </main>
    </>
  )
}

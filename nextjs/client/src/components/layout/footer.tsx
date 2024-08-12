export default function Footer() {
  return (
    <footer className='footer'>
      <p>Copyright &copy; 2024 Jason Filby</p>
      <p>Developed for {process.env.NEXT_PUBLIC_DEVELOPED_FOR}</p>
    </footer>
  )
}

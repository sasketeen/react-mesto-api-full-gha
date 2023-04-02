/** Компонент футера */
export default function Footer() {
  const curruntYear = new Date().getFullYear();
  return (
    <footer className="footer">
      <p className="footer__copyright">&copy; {curruntYear} Mesto Russia</p>
    </footer>
  );
}

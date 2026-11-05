import "./Errorpage.css";

const BACKGROUND = `${process.env.PUBLIC_URL}/assets/error_bg_image.jpg`;
const RHINO = `${process.env.PUBLIC_URL}/assets/rhino.png`;

export default function Errorpage({
  title = "OOPS !",
  message = "Error 404. Page not found.",
}) {
  return (
    <main
      className="error-page"
      style={{ backgroundImage: `url(${BACKGROUND})` }}
    >
      <div className="error-text">
        <h1 className="error-title">{title}</h1>
        <p className="error-message">{message}</p>
        <a href="/" className="error-home-btn">Go back home</a>
      </div>

      <img src={RHINO} alt="" className="error-rhino" />
    </main>
  );
}
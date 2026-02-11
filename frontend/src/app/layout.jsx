import "../index.css";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "Exam Monitor",
};

const RootLayout = ({ children }) => (
  <html lang="en">
    <body>
      <Navbar />
      {children}
    </body>
  </html>
);

export default RootLayout;

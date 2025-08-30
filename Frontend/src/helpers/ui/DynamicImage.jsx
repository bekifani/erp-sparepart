import { useSelector } from "react-redux";

const DynamicImage = ({ imagePath, token }) => {
    const media_url = useSelector((state)=>state.auth.media_url)
    return (
      <div>
        <img src={media_url + imagePath} alt="Tenant" style={{ maxWidth: "100%", height: "auto" }} />
      </div>
    );
}

export default DynamicImage
import './Designer.scss';
import FontSize from "./font-size/FontSize";
import FontFamily from "./font-family/FontFamily";

function Designer() {
    return (
        <div className="Designer tool-box">
            <FontFamily/>
            <FontSize/>
        </div>
    );
}

export default Designer;
import {useNavigate} from "react-router-dom"
import {getBackendURL} from "/src/utils/reader";

export default function WechatLogin() {
    const appid = "wxde3d9979b5c7aa1b"
    const scope = "snsapi_login"
    const state = "STATE"
    const self_redirect = "true"
    const redirect_uri = `${getBackendURL()}/wxredirect` //"https://api.keanu.plus/wxredirect"
    const link =
        "https://open.weixin.qq.com/connect/qrconnect?appid=" + appid + "&scope=" +
        scope + "&redirect_uri=" + redirect_uri + "&state=" + state +
        "&login_type=jssdk&self_redirect=" + self_redirect;

    return (<iframe style={{width: "300px", height: "400px",}} src={link}>
    </iframe>)
}
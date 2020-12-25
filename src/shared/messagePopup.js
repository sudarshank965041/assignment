import swal from "sweetalert";

export default function messagePopup(header,message,response){
    swal(header, message, response);
}
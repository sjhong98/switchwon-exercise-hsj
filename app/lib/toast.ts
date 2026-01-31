import { toast } from "react-toastify";

export const errorToast = (message: string) => {
    toast.error(message, { hideProgressBar: true, autoClose: 2000 });
}
import { toast } from "react-toastify";

export const errorToast = (message: string, useMessageAsId?: boolean) => {
    const _toastId = useMessageAsId === false ? undefined : message;
    toast.error(message, { hideProgressBar: true, autoClose: 1500, toastId: _toastId });
}

export const successToast = (message: string, useMessageAsId?: boolean) => {
    const _toastId = useMessageAsId === false ? undefined : message;
    toast.success(message, { hideProgressBar: true, autoClose: 1500, toastId: _toastId });
}
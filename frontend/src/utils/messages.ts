import { toast } from "react-toastify"

export const generateError = (error: string) => {
    toast.error(error, {
        position: "bottom-right",
    })
}

export const generateSuccess = (message: string) => {
    toast.success(message, {
        position: "bottom-right",
    })
}
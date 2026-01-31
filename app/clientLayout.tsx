'use client'

import { CookiesProvider } from "react-cookie"
import { ToastContainer } from "react-toastify"


export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <ToastContainer />
            <CookiesProvider defaultSetOptions={{}}>
                {children}
            </CookiesProvider>
        </div>
    )
}
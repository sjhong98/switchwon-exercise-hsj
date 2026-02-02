'use client'

import { CookiesProvider } from "react-cookie"
import { ToastContainer } from "react-toastify"
import QueryProvider from "./providers/queryProvider"


export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <ToastContainer />
            <CookiesProvider defaultSetOptions={{}}>
                <QueryProvider>
                    {children}
                </QueryProvider>
            </CookiesProvider>
        </div>
    )
}
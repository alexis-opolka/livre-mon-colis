"use client"

import { useEffect } from "react";

export default function Bootstrapable({
    children,
}: {
    children: React.ReactNode
}){

    useEffect(() => {
        // @ts-ignore
        // This issue is caused by the fact that TypeScript doesn't know the type of what we're importing
        // which is not relevant for us, since we know exactly that we're importing a JS module for Bootstrap
        import('bootstrap/dist/js/bootstrap.js');
    })

    return (
        <>
            {children}
        </>
    )
}
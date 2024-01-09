"use client";

import style from '../user.module.sass';
import { useEffect, useState } from 'react';

export default function UserPage() {

    const [username, setUsername] = useState("");
    const [userRole, setUserRole] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            const currentUser = localStorage.getItem("currentUser");
            if (currentUser) {
                const user = JSON.parse(currentUser);
                if (user && user.username) {
                    setUsername(user.username);
                }

                if (user && user.role) {
                    setUserRole(user.role);
                }
            }
        }
    }, [setUsername])

    return (
        <div>
            <header className={style.userHeader}>
                You&apos;re now logged in as a { userRole }, { username }!
            </header>

            <main>
            </main>
        </div>
    )
}


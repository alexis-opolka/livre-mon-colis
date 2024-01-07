"use client";

import { useRouter } from "next/navigation";
import style from '../user.module.sass';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

import { YupFormSelect, YupFormInput } from "@components/yupForms";

export default function UserPage() {

    /** A simple function to create a required message, if minimumRequiredChars is not provided, it will only say that the field is required
     * 
     * @param requiredElement <string> The element that is required
     * @param minimumRequiredChars <number> The minimum number of characters required
     * @returns 
     */
    function createRequiredMsg(requiredElement: string, minimumRequiredChars?: number) {
        return minimumRequiredChars ? `${requiredElement} must be at least ${minimumRequiredChars} characters` : `${requiredElement} is required`;
    }

    const router = useRouter();
    const pwdLength = 4;

    // User form interface
    interface userForm {
        username: string,
        password: string,
    }

    // form validation rules
    const validationSchema = yup.object().shape({
        username: yup.string().required(createRequiredMsg("Username")),
        password: yup.string().required(createRequiredMsg("Password")).min(pwdLength, createRequiredMsg("Password", pwdLength)),
    })
    const formOptions = { resolver: yupResolver(validationSchema) };

    const { register, handleSubmit, reset, formState } = useForm(formOptions);
    const { errors } = formState;

    function onSubmit(user: userForm) {
        console.log("USER:", user);

        // First of all, we need to encrypt the password and then send it to the server
        // where it will be decrypted, re-encrypted and stored in the database

        const form = fetch("http://localhost:3000/proxy?path=/api/user/"+user.username, {
            method: "GET",
        }).then(data => data.json()).then(data => {
            console.debug("DATA:", data);
            router.push("/user/login");
        });
    }

    return (
        <div>
            <header className={style.userHeader}>
                User Login Page form
            </header>

            <main>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <section className={style.userFormHolder}>

                        <section className={style.userFormSection}>
                            <YupFormInput name="username" label="Username" id="user-username" registerFunction={register} errorsHolder={errors.username} />
                        </section>

                        <section className={style.userColumnedFormSection}>
                            <YupFormInput name="password" label="Password" id="user-password" inputType="password" registerFunction={register} errorsHolder={errors.password} />
                        </section>

                        <button disabled={formState.isSubmitting} className="btn btn-primary">
                            Login
                        </button>
                    </section>
                </form>
            </main>
        </div>
    )
}

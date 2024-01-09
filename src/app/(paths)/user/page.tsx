"use client";

import {useRouter} from "next/navigation";
import style from './user.module.sass';
import {useForm} from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

import {YupFormSelect, YupFormInput} from "@components/yupForms";

export default function UserPage(){

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
        passwordVerification: string,
        roles: string,
    }

    // form validation rules
    const validationSchema = yup.object().shape({
        username: yup.string().required(createRequiredMsg("Username")),
        password: yup.string().required(createRequiredMsg("Password")).min(pwdLength, createRequiredMsg("Password", pwdLength)),
        passwordVerification: yup.string().required(createRequiredMsg("Password")).min(pwdLength, createRequiredMsg("Password", pwdLength)).oneOf([yup.ref('password')], 'Passwords must match'),
        roles: yup.string().notRequired(),
    })
    const formOptions = { resolver: yupResolver(validationSchema) };

    const { register, handleSubmit, reset, formState } = useForm(formOptions);
    const { errors } = formState;

    function onSubmit(user: userForm) {
        console.log("USER:", user);

        // First of all, we need to encrypt the password and then send it to the server
        // where it will be decrypted, re-encrypted and stored in the database

        const form = fetch("http://localhost:3000/proxy?path=/api/user/create/", {
            method: "POST",
            body: JSON.stringify({
                username: user.username,
                password: user.password,
                roles: user.roles,
            }),
        }).then(data => data.json()).then(data => {
            console.debug("DATA:", data);
            router.push("/user/login");
        });
    }

    return (
        <div>
            <header className={style.userHeader}>
                User Page form
            </header>

            <main>
                <form onSubmit={
                    // @ts-ignore
                    handleSubmit(onSubmit)
                    }>
                    <section className={style.userFormHolder}>

                        <section className={style.userFormSection}>
                            <YupFormInput name="username" label="Username" id="user-username" registerFunction={register} errorsHolder={errors.username} />
                        </section>

                        <section className={style.userColumnedFormSection}>
                            <YupFormInput name="password" label="Password" id="user-password" inputType="password" registerFunction={register} errorsHolder={errors.password} />
                            <YupFormInput name="passwordVerification" label="Re-enter your Password" id="user-password-verification" inputType="password" registerFunction={register} errorsHolder={errors.passwordVerification} />
                        </section>

                        <section className={style.userFormSection}>
                            <YupFormSelect name="roles" label="User's role" id="user-roles" options={["seller", "carrier", "client"]} registerFunction={register} errorsHolder={errors.roles} />
                        </section>

                        <button disabled={formState.isSubmitting} className="btn btn-primary">
                            Register
                        </button>
                    </section>
                </form>
            </main>
        </div>
    )
}

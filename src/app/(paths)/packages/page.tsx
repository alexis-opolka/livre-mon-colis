"use client";


import style from "./packages.module.sass";

import { set, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useEffect, useState } from "react";
import { YupFormSelect, YupFormInput } from "@components/yupForms";
import { useRouter } from "next/navigation";
import { guard } from "@/(components)/guard";

export default function Packages(){

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

    // Package Creation Form interface
    interface newPackageForm {
        packageName: string,
        sellerName: string,
        carrierName: string,
        clientName: string,
    }
    interface localUserInterface {
        username: string,
        role: string[],
        data: {
            loggedIn: boolean,
            role: string[]
        }
    }

    // form validation rules
    const validationSchema = yup.object().shape({
        packageName: yup.string().required(createRequiredMsg("Package Name")),
        sellerName: yup.string().required(createRequiredMsg("Seller Name")),
        carrierName: yup.string().required(createRequiredMsg("Carrier Name")),
        clientName: yup.string().required(createRequiredMsg("Client Name")),
    })
    const formOptions = { resolver: yupResolver(validationSchema) };

    const { register, handleSubmit, reset, formState } = useForm(formOptions);
    const { errors } = formState;

    function onSubmit(_package: newPackageForm) {
        console.log("USER:", _package);

        // First of all, we need to encrypt the password and then send it to the server
        // where it will be decrypted, re-encrypted and stored in the database

        const form = fetch("http://localhost:3000/proxy?path=/api/package/new", {
            method: "POST",
            body: JSON.stringify({
                seller: _package.sellerName,
                carrier: _package.carrierName,
                client: _package.clientName,
            }),
        }).then(data => data.json()).then(data => {
            console.debug("DATA:", data);
        });
    }

    const [currentUser, setCurrentUser] = useState<localUserInterface | undefined>(undefined);
    const [userRole, setUserRole] = useState<string[] | undefined>(undefined);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const localUser: any = JSON.parse(localStorage.getItem("currentUser") || "{}") ?? {
                username: ""
            };
            if (currentUser !== localUser.username) setCurrentUser(localUser);
            if (userRole !== localUser.role) setUserRole(localUser.role);
            console.log("USER:", currentUser, userRole)
            if (!localUser) {
                router.push("/user/login");
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Return the page with the header and main content (using Bootstrap)
    // the main content should hold a form to create a new package containing the following fields:
    // - Package name
    // - Seller name
    // - Carrier name
    // - Client name

    if (guard(currentUser)) {
        
        let sellersList: string[] | Promise<any> = [];
        let carriersList: string[] | Promise<any> = [];

        if (guard(userRole)) {
            if (userRole[0] == "seller") {
                sellersList = [currentUser.username];
            } else {
                sellersList = fetch("http://localhost:3000/proxy?path=/api/seller/list", {
                    method: "GET",
                }).then(data => data.json()).then( json => {
                    return json["content"];
                }).catch( error => {
                    console.error("ERROR:", error);
                    return [];
                })
            }

            return (
                <div>
                    <header className={style.PackagesHeader}>
                        Packages Page
                    </header>

                    <main className={style.PackagesFormSection}>
                        <section id="user-info">
                            <h2>User Info</h2>
                            <hr />
                            <div>
                                <div>
                                    <label htmlFor="user-info-username">Username: &nbsp;</label>
                                    <span id="user-info-username">{currentUser.username}</span>
                                </div>
                                <div>
                                    <label htmlFor="user-info-role">Role: &nbsp;</label>
                                    <span id="user-info-role">{userRole ? userRole : userRole}</span>
                                </div>
                            </div>
                        </section>
                        <section>
                            <h2>Create a new Package</h2>
                            <hr />
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="mb-3">
                                    <YupFormInput name="packageName" label="Package Name" id="package-packageName" registerFunction={register} errorsHolder={errors.packageName} />
                                </div>
                                <div className="mb-3">
                                    <YupFormSelect name="sellerName" label="Seller Name" id="package-sellerName" registerFunction={register} errorsHolder={errors.sellerName} options={sellersList} />
                                </div>
                                <div className="mb-3">
                                    <CarriersList userRole={userRole[0]} userName={currentUser.username} register={register} errors={errors.carrierName} />
                                </div>
                                <div className="mb-3">
                                    <ClientsList userRole={userRole[0]} userName={currentUser.username} register={register} errors={errors.clientName} />
                                </div>
                                <div className="mb-3">
                                    <button type="submit" disabled={formState.isSubmitting} className="btn btn-primary">Create Package</button>
                                </div>
                            </form>
                        </section>
                        <section>
                            <h2>Your packages</h2>
                            <hr />
                            <PackagesTable username={currentUser.username} />
                        </section>

                    </main>
                </div>
            )
        }
    }
}

function PackagesTable({
    username,
}: {
    username: string
}){
    const [packagesList, setPackagesList] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [sellerName, setSellerName] = useState<string>("");
    const [carrierName, setCarrierName] = useState<string>("");
    const [clientName, setClientName] = useState<string>("");


    useEffect(() => {
        fetch("http://localhost:3000/proxy?path=/api/package/all/by-seller?username="+username, {
            method: "GET",
        }).then(data => data.json()).then(json => {
            // console.log("PACKAGES DATA:", json)

            for (let i = 0; i < json.content.length; i++) {
                // console.log("PACKAGE:", json.content[i]);
                
                fetch("http://localhost:3000/proxy?path=/api/package/"+json.content[i],).then( data => data.json()).then(
                    json => {

                        console.log("PACKAGE:", json.content, packagesList);

                        fetch("http://localhost:3000/proxy?path=/api/seller/name/"+json.content.seller, {
                            method: "GET",
                        }).then(data => data.json()).then(json => {
                            setSellerName(json.content);
                        }).catch(error => { console.error("ERROR:", error); return ""; })

                        fetch("http://localhost:3000/proxy?path=/api/carrier/name/"+json.content.carrier, {
                            method: "GET",
                        }).then(data => data.json()).then(json => {
                            setCarrierName(json.content);
                        }).catch(error => { console.error("ERROR:", error); return ""; })

                        fetch("http://localhost:3000/proxy?path=/api/client/name/"+json.content.client, {
                            method: "GET",
                        }).then(data => data.json()).then(json => {
                            setClientName(json.content);
                        }).catch(error => { console.error("ERROR:", error); return ""; })

                        const displayableTableRow = (
                            <tr key={json.content._id}>
                                <td>{json.content._id}</td>
                                <td>{sellerName}</td>
                                <td>{carrierName}</td>
                                <td>{clientName}</td>
                            </tr>
                        )

                        setPackagesList([...packagesList, displayableTableRow])
                    }
                )
            }

        }).catch(error => {
            console.error("ERROR:", error);
            return [];
        }).finally(() => {
            console.log("PACKAGES:", packagesList);
            setIsLoading(false);
        })
    }, [])


    if (!isLoading) {
        return (
            <table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Seller</th>
                        <th>Carrier</th>
                        <th>Client</th>
                    </tr>
                </thead>
                {packagesList?.map((displayableRow: Element, currentIndex: number) => {
                    return displayableRow;
                })}
            </table>
        )
    } else {
        return (
            <>
                Here will be your packages....
            </>
        )
    }
}

function CarriersList({
    userRole,
    userName,
    register,
    errors,
}: {
    userRole: string,
    userName: string,
    register: CallableFunction,
    errors: any
}) {

    const [carriersList, setCarriersList] = useState<string[] | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(true);


    useEffect(() => {
        if (userRole[0] == "carrier") {
            setCarriersList([userName]);
        } else {
            fetch("http://localhost:3000/proxy?path=/api/carrier/list", {
                method: "GET",
            }).then(data => data.json()).then(json => {

                console.log("CARRIERS:", json["content"]);

                setCarriersList(json["content"]);
            }).catch(error => {
                console.error("ERROR:", error);
                return [];
            }).finally(() => {
                setIsLoading(false);
            })
        }
    }, [])


    if (!isLoading) {
        return <YupFormSelect name="carrierName" label="Carrier Name" id="package-carrierName" registerFunction={register} errorsHolder={errors} options={carriersList} />
    } else {
        return <YupFormInput name="carrierName" label="Carrier Name" id="package-carrierName" registerFunction={register} errorsHolder={errors} />
    }

}

function ClientsList({
    userRole,
    userName,
    register,
    errors,
}: {
    userRole: string,
    userName: string,
    register: CallableFunction,
    errors: any
}) {

    const [clientsList, setClientsList] = useState<string[] | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(true);


    useEffect(() => {
        if (userRole[0] == "client") {
            setClientsList([userName]);
        } else {
            fetch("http://localhost:3000/proxy?path=/api/client/list", {
                method: "GET",
            }).then(data => data.json()).then(json => {

                console.log("CLIENTS:", json["content"]);

                setClientsList(json["content"]);
            }).catch(error => {
                console.error("ERROR:", error);
                return [];
            }).finally(() => {
                setIsLoading(false);
            })
        }
    }, [])


    if (!isLoading) {
        if (guard(clientsList)){
            return <YupFormSelect name="clientName" label="Client Name" id="package-clientName" registerFunction={register} errorsHolder={errors} options={clientsList} />
        } else {
            return <YupFormInput name="clientName" label="Client Name" id="package-clientName" registerFunction={register} errorsHolder={errors} />
        }
    } else {
       return <YupFormInput name="clientName" label="Client Name" id="package-clientName" registerFunction={register} errorsHolder={errors} />
    }
}
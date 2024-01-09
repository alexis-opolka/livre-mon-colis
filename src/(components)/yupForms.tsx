import { CreateCompatibleOutputReactNode } from "./ContentConverter";

// <YupFormSelect name="roles" id="user-roles" options={["admin", "user"]} />
export function YupFormSelect({
    name,
    id,
    options,
    label,
    registerFunction,
    errorsHolder,
}: {
    name: string,
    id: string,
    options: string[] | any,
    label?: string,
    registerFunction: CallableFunction,
    errorsHolder?: any,
}): JSX.Element {
    return (
        <div>
            <label htmlFor={name}>{label ? label : name}: &nbsp;</label>
            <select name={name} id={id}
                {...registerFunction(name)}
                className={`form-control ${errorsHolder ? 'is-invalid' : ''}`}>
                {options.map((option: any) => {
                    return (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    );
                })}
            </select>
        </div>
    )
}



// <YupFormSelect name="roles" id="user-roles" options={["admin", "user"]} />
export function YupFormInput({
    name,
    id,
    label,
    inputType,
    registerFunction,
    errorsHolder,
    value,
}: {
    name: string,
    id: string,
    label?: string,
    inputType?: string,
    registerFunction: CallableFunction,
    errorsHolder: any,
    value?: any,
}): JSX.Element {
    return (
        <div>
            <label htmlFor={name}>{label ? label : name}: &nbsp;</label>
            <input id={id} name={name} type={inputType ? inputType : "text"} {...registerFunction(name)} className={`form-control ${errorsHolder ? 'is-invalid' : ''}`} {
                ...(value ? { value: value } : {})
            } />
            <div className="invalid-feedback">{CreateCompatibleOutputReactNode(errorsHolder)}</div>
        </div>
    )
}
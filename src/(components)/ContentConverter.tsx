export function CreateCompatibleOutputReactNode(content: any){
    return (
        <span style={{
            color: "red",
        }}>
            {content?.message}
        </span>
    )
}
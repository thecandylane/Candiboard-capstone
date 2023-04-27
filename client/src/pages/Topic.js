

const Topic = ({id, name, onClick}) => {

    return (
        <div onClick={() => onClick(id)}>
            {name}
        </div>
    )
}

export default Topic


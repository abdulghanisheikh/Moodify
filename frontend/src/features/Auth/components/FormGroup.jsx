const FormGroup = ({label, placeholder, type, value, name, onChange}) => {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-sm text-neutral-400">{label}</label>
            <input
              type={type}
              value={value}
              name={name}
              placeholder={placeholder}
              onChange={onChange}
              className="w-full px-4 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-sm placeholder:text-neutral-600 outline-none focus:border-neutral-600"
            />
        </div>
    )
}

export default FormGroup;
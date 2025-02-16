import { useExtension } from "@/contexts/extensionContext"
import { httpAxios } from "@/utils/services/axios"
import type { SignInFormType } from "@/utils/types/components/popup"
import { useForm } from "react-hook-form"

const SignInForm = () => {
  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<SignInFormType>()
  const { dispatch } = useExtension()

  const handleOnSubmit = async (data: SignInFormType) => {
    try {
      const res = await httpAxios.post("/auth/signin", data)
      if (res.status === 200) {
        dispatch({ type: "AUTH", payload: true })
      }
    } catch (error:any) {
      console.error(error?.response?.data?.message)
    }
  }

  return (
    <main className="w-full space-y-8">
      {/* Logo */}
      <div className="flex items-center justify-center">
        <div className="w-[40px] h-[40px] rounded-full overflow-hidden">
          <img src={"/icon.png"} alt="ChatGPT Manager" />
        </div>
      </div>

      <form
        onSubmit={handleSubmit((data: any) => handleOnSubmit(data))}
        className="space-y-3">
        <div className="space-y-1">
          <div className="border border-black/60">
            <input
              type="text"
              placeholder="Enter email address..."
              className="bg-transparent outline-none p-2"
              {...register("email", { required: "Email is required" })}
            />
          </div>
          {errors?.email && (
            <p className="text-[10px] text-red-600">{errors?.email?.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="space-y-1">
            <div className="border border-black/60">
              <input
                type="password"
                placeholder="Enter your passsword..."
                className=" bg-transparent outline-none p-2"
                {...register("password", {
                  required: "Password is required",
                  min: 6
                })}
              />
            </div>
            {errors?.password && (
              <p className="text-[10px] text-red-600">
                {errors?.password?.message}
              </p>
            )}
          </div>
          <div>
            Don't have an account?{" "}
            <a
              href="https://botaddons.com/auth/signup"
              target="_blank"
              className="text-blue-600 underline">
              be a member
            </a>
          </div>
        </div>

        {/* submit button */}
        <button className="w-full py-2 text-center text-white bg-blue-600">
          Submit
        </button>
      </form>
    </main>
  )
}

export default SignInForm

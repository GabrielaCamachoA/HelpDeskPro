"use client";
import { useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { FormEvent, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "../components/i18n-providers";

import { AuthContext } from "@/app/components/Providers";
import api from "@/libs/api";

function LoginPage() {
  const { register, formState: { errors } } = useForm();
  const { dict } = useI18n();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { login } = useContext(AuthContext);

  const handlerSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await api.post("/auth/login", {
        email: formData.get("email"),
        password: formData.get("password"),
      });

      // Guardar sesión
      login(res.data.user, res.data.token);

      // Redirección según el rol
      if (res.data.user.role === "agent") router.push("/agent/dashboard");
      else router.push("/client/dashboard");

    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Error al iniciar sesión");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0f14] to-[#1b1b26]">
      <div className="backdrop-blur-md bg-white/10 border border-white/20 p-10 rounded-2xl w-full max-w-md shadow-2xl">
        
        <h1 className="text-4xl font-bold mb-8 text-center text-indigo-400">
          {dict?.login?.title}
        </h1>

        {error && <Message severity="error" text={error} className="mb-4" />}

        <form onSubmit={handlerSubmit} className="flex flex-col gap-6">
          
          {/* EMAIL */}
          <span className="p-float-label">
            <InputText
              id="email"
              className="w-full"
              {...register("email", { required: "Email required" })}
            />
            <label htmlFor="email">{dict?.login?.email}</label>
          </span>
          {errors.email && (
            <Message
              severity="error"
              text={String(errors.email.message)}
              className="mt-1"
            />
          )}

          {/* PASSWORD */}
          <span className="p-float-label">
            <Password
              feedback={false}
              toggleMask
              className="w-full! block!"
              inputClassName="w-full!"
              {...register("password", { required: "Password required" })}
            />
            <label>{dict?.login?.password}</label>
          </span>
          {errors.password && (
            <Message
              severity="error"
              text={String(errors.password.message)}
              className="mt-1"
            />
          )}

          {/* SUBMIT */}
          <Button label={dict?.login?.submit} className="mt-4 w-full" />

        </form>
      </div>
    </div>
  );
}

export default LoginPage;

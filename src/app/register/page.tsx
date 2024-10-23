"use client";
import Loading from "@/Components/Loading";
import axios from "axios";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ImSpinner9 } from "react-icons/im";
import { RxCross1 } from "react-icons/rx";

const imgbb_api_key = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
const img_hosting_api = `https://api.imgbb.com/1/upload?key=${imgbb_api_key}`;

const Page: React.FC = () => {
  const router = useRouter();
  const { status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [extraLoading, setExtraLoading] = useState(true);
  const [imgLoading, setImgLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Task Manager | Register";
  }, [status]);

  useEffect(() => {
    if (status === "loading") {
      // While session is loading, don't redirect
      return;
    }

    if (status === "authenticated") {
      router.push("/");
    } else {
      setExtraLoading(false); // Allow the register form to show
    }
  }, [status, router]);

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!imageUrl) {
      toast.error("Upload your Profile Picture");
      return;
    }
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;

    try {
      const email = (form.elements.namedItem("email") as HTMLInputElement)
        .value;
      const password = (form.elements.namedItem("password") as HTMLInputElement)
        .value;
      const newUser = {
        name,
        email,
        password,
        image: imageUrl,
        role: "user",
      };
      setIsLoading(true);
      const { data } = await axios.post(`/register/api`, newUser);
      console.log(data);
      if (data?.created) {
        toast.success("Account Created Successfully");
        // Automatically sign the user in after successful sign-up
        const result = await signIn("credentials", {
          redirect: false,
          email: newUser.email,
          password: newUser.password,
        });
        if (result?.error) {
          setIsLoading(false);
          toast.error("Signing Failed, Try Logging In");
        } else {
          // Redirect to the desired page after successful login
          setIsLoading(false);
          form.reset();
          router.push("/");
        }
      }else{
        setIsLoading(false);
        toast.error(data?.message)
      }
    } catch (error: unknown) {
      setIsLoading(false);
      form.reset();
      if (error instanceof Error) {
        console.error("Registration Error:", error);
        toast.error(error.message || "An error occurred");
      } else {
        console.error("Registration Error:", error);
        toast.error("An unexpected error occurred");
      }
    }
  };

  // handle image
  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      toast.error("No file selected");
      return;
    }

    const image = files[0];
    const formData = new FormData();
    formData.append("image", image);
    try {
      setImgLoading(true);
      const { data } = await axios.post(img_hosting_api, formData);
      // console.log(data)
      setImgLoading(false);
      setImageUrl(data.data.display_url);
    } catch (error) {
      console.log(error);
      toast.error("Problem while uploading image!");
      setImgLoading(false);
    }
  };

  if (isLoading || status === "loading" || extraLoading) {
    return <Loading />;
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-main">
      <div className="rounded shadow-md md:w-[30%] w-full mx-auto p-5">
        <h3 className="text-2xl text-center mb-5">Register</h3>
        <form onSubmit={handleRegister} className="flex flex-col gap-3">
          <input
            type="text"
            name="name"
            className="w-full border p-3 rounded"
            placeholder="Enter Your Full Name"
            required
          />
          <input
            type="email"
            name="email"
            className="w-full border p-3 rounded"
            placeholder="Enter Your Email"
            required
          />
          <div className="form-group w-full">
            {imgLoading && imageUrl === null ? (
              <div className="h-[49px] flex items-center justify-center bg-slate-200 rounded-md">
                <ImSpinner9 className="animate-spin m-auto" size={24} />
              </div>
            ) : (
              <div className="relative">
                {/* Custom button-styled label */}
                <label
                  htmlFor="imageUpload"
                  className={`flex items-center justify-center w-full h-[49px] bg-slate-200 border border-gray-300 rounded-lg text-gray-700 cursor-pointer hover:bg-gray-300 transition-all duration-200 $ disabled:cursor-not-allowed`}
                >
                  {imageUrl ? "Image Uploaded" : "Upload an Image"}
                  {imageUrl && (
                    <span className="h-[48.8px] flex items-center justify-center px-2">
                      <RxCross1
                        title="Cancel Upload"
                        onClick={() => {
                          setImageUrl(null);
                        }}
                        className="cursor-pointer shadow-2xl rounded-full"
                        color="#f43f5e"
                      />
                    </span>
                  )}
                </label>

                {/* Hidden file input */}
                <input
                  id="imageUpload"
                  type="file"
                  name="image"
                  disabled={!!imageUrl}
                  onChange={handleImage}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            )}
          </div>

          <input
            type="password"
            name="password"
            className="w-full border p-3 rounded"
            placeholder="Enter Your Password"
            required
          />
          <p className="text-[10px] ml-1 cursor-pointer">Forget Password?</p>
          <button
            disabled={imgLoading}
            className="w-full bg-main rounded text-white p-2"
          >
            Register
          </button>
        </form>
        <p className="text-base my-3 text-center">
          Already have an Account?{" "}
          <span>
            <Link
              className="text-blue-500 cursor-pointer"
              href={"/login"}
            >
              Login Here
            </Link>
          </span>
        </p>
      </div>
    </div>
  );
};

export default Page;

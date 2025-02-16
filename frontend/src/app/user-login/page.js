'use client'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { LogIn } from 'lucide-react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import toast from 'react-hot-toast'
import { loginUser, registerUser } from '@/service/auth.service'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const page = () => {

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(1)

    const registerSchema = yup.object().shape({
        name: yup.string().required("Name is required"),
        email: yup.string().email("Invalid email format").required("Email is required"),
        password: yup.string().min(6, "Password must be at least 6 characters ").required("Password is required"),
        gender: yup.string().oneOf(['male', 'female', 'other'], 'Please Select a Gender').required("Gender is required"),
        studentID: yup.string().required("Student ID is required"),
        userType: yup
            .string().oneOf(["student", "alumni"])
            .required("Please select if you are a student or alumni"),
        batch: yup.number().when("userType", (userType, schema) => {
            return userType === "alumni"
                ? schema.required("Batch is required for alumni").typeError("Batch must be a number")
                : schema;
        }),
        graduationYear: yup.number().when("userType", (userType, schema) => {
            return userType === "alumni"
                ? schema.required("Graduation year is required for alumni").typeError("Graduation year must be a number")
                : schema;
        }),
    })
    const loginSchema = yup.object().shape({
        email: yup.string().email("Invalid email format").required("Email is required"),
        password: yup.string().min(6, "Password must be at least 6 characters ").required("Password is required"),
    })
    const { register: registerLogin, handleSubmit: handleSubmitLogin, reset: resetLoginForm, formState: { errors: errorsLogin } } = useForm({
        resolver: yupResolver(loginSchema),
        defaultValues: {
            userType: "student",  // ✅ Ensures userType is always defined
        }
    })
    const { register: registerSignUp, setValue, getValues, handleSubmit: handleSubmitSignUp, reset: resetSignUpForm, formState: { errors: errorsSignUp } } = useForm({
        resolver: yupResolver(registerSchema)
    })

    const onSubmitRegister = async (data) => {
        console.log("onSubmitRegister called");
        console.log(data);
        try {
            const result = await registerUser(data)
            console.log("Backend Response:", result); // Debuggin
            if (result.status === 'success') {
                router.push('/')
            }
            toast.success('User register sucessfully')
        } catch (error) {
            console.error("Error during registration:", error); // Debugging
            toast.error('Email already exists')
        } finally {
            setIsLoading(false)
        }
    }

    // reset the form
    useEffect(() => {
        resetSignUpForm(),
            resetLoginForm()
    }, [resetLoginForm, resetSignUpForm])

    const onSubmitLogin = async (data) => {
        try {
            const result = await loginUser(data)
            if (result.status === 'success') {
                router.push('/')
            }
            toast.success('User login sucessfully')
        } catch (error) {
            console.error(error);
            toast.error('Email or password invalid')
        } finally {
            setIsLoading(false)
        }
    }
    const [isAlumni, setIsAlumni] = useState(false);
    return (
        <div className='min-h-screen bg-gradient-to-br from-green-400 to-green-800 flex items-center justify-center p-4'>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <Card className='w-full max-w-md dark:text-white'>
                    <CardHeader>
                        <CardTitle className='text-2xl font-bold' align='center'><span>CUETbook</span></CardTitle>
                        <CardDescription className='text-center'>Connect with friends and the world around you on CUETbook</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs default='login' className='w-full'>
                            <TabsList className='grid grid-cols-2'>
                                <TabsTrigger value="login">Login</TabsTrigger>
                                <TabsTrigger value="signup">SignUp</TabsTrigger>
                            </TabsList>
                            <TabsContent value='login'>
                                <form onSubmit={handleSubmitLogin(onSubmitLogin)}>
                                    <div className='space-y-4'>
                                        <div className='space-y-2'>
                                            <Label htmlFor='loginEmail'>Email</Label>
                                            <Input
                                                id='loginEmail'
                                                name='email'
                                                type='email'
                                                {...registerLogin('email')}
                                                placeholder='Enter your Email'
                                                className='dark:border-gray-400'
                                            />
                                            {errorsLogin.email && <p className='text-red-500'>{errorsLogin.email.message}</p>}
                                        </div>
                                        <div className='space-y-2'>
                                            <Label htmlFor='loginPassword'>Password</Label>
                                            <Input
                                                id='loginPassword'
                                                name='password'
                                                type='password'
                                                {...registerLogin('password')}
                                                placeholder='Enter your Password'
                                                className='dark:border-gray-400'
                                            />
                                            {errorsLogin.password && <p className='text-red-500'>{errorsLogin.password.message}</p>}
                                        </div>
                                        <Button className='w-full' type='submit'>
                                            <LogIn className='w-4 h-4' />Log in
                                        </Button>
                                    </div>
                                </form>
                            </TabsContent>
                            <TabsContent value="signup" className="mt-500">
                                <form onSubmit={handleSubmitSignUp((data) => {
                                    console.log("Form Submitted Data:", data); // ✅ Check if this logs
                                    onSubmitRegister(data);
                                })}>
                                    <div className="grid grid-cols-2 gap-6">
                                        {/* Column 1 */}
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="signupName">Username</Label>
                                                <Input
                                                    id="signupName"
                                                    name="name"
                                                    type="text"
                                                    {...registerSignUp("name")}
                                                    placeholder="Enter your username"
                                                    className="col-span-3 dark:border-gray-400"
                                                />
                                                {errorsSignUp.name && (
                                                    <p className="text-red-500">
                                                        {errorsSignUp.username.message}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="signupGender">Gender</Label>
                                                <select
                                                    id="signupGender"
                                                    {...registerSignUp("gender")}
                                                    className="w-full border dark:border-gray-400 text-sm rounded-md px-2 py-2"
                                                >
                                                    <option value="">Select your gender</option>
                                                    <option value="male">Male</option>
                                                    <option value="female">Female</option>
                                                    <option value="other">Other</option>
                                                </select>
                                                {errorsSignUp.gender && (
                                                    <p className="text-red-500">
                                                        {errorsSignUp.gender.message}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="signupEmail">Email</Label>
                                                <Input
                                                    id="signupEmail"
                                                    name="email"
                                                    type="email"
                                                    {...registerSignUp("email")}
                                                    placeholder="Enter your email"
                                                    className="col-span-3 dark:border-gray-400"
                                                />
                                                {errorsSignUp.email && (
                                                    <p className="text-red-500">
                                                        {errorsSignUp.email.message}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Column 2 */}
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="signupPassword">Password</Label>
                                                <Input
                                                    id="signupPassword"
                                                    name="password"
                                                    type="password"
                                                    {...registerSignUp("password")}
                                                    placeholder="Enter your Password"
                                                    className="col-span-3 dark:border-gray-400"
                                                />
                                                {errorsSignUp.password && (
                                                    <p className="text-red-500">
                                                        {errorsSignUp.password.message}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="signupStudentID">Student ID</Label>
                                                <Input
                                                    id="signupStudentID"
                                                    name="studentID"
                                                    type="text"
                                                    {...registerSignUp("studentID")}
                                                    placeholder="Enter your Student ID"
                                                    className="col-span-3 dark:border-gray-400"
                                                />
                                                {errorsSignUp.studentID && (
                                                    <p className="text-red-500">
                                                        {errorsSignUp.studentID.message}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 mt-6">
                                        <Label>Status</Label>
                                        <RadioGroup
                                            className="flex justify-between"
                                            {...registerSignUp("userType")}
                                            onValueChange={
                                                (value) => {
                                                    setValue("userType", value === "alumni" ? "alumni" : "student");
                                                    setIsAlumni(value === "alumni");
                                                    // Reset batch and graduationYear fields when user selects "student"
                                                    if (value === "current") {
                                                        setValue("batch", undefined);
                                                        setValue("graduationYear", undefined);
                                                    }
                                                }
                                            }

                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="current" id="current" />
                                                <Label htmlFor="current">Current Student</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="alumni" id="alumni" />
                                                <Label htmlFor="alumni">CUET Alumni</Label>
                                            </div>
                                        </RadioGroup>
                                        {errorsSignUp.isAlumni && (
                                            <p className="text-red-500">
                                                {errorsSignUp.isAlumni.message}
                                            </p>
                                        )}
                                    </div>


                                    {isAlumni && (
                                        <Dialog open={isAlumni} onOpenChange={setIsAlumni}>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Alumni Details</DialogTitle>
                                                </DialogHeader>
                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="batch">Batch</Label>
                                                        <Input
                                                            id="batch"
                                                            name="batch"
                                                            type="number"
                                                            {...registerSignUp("batch")}
                                                            placeholder="Enter your batch"
                                                        />
                                                        {errorsSignUp.batch && (
                                                            <p className="text-red-500">
                                                                {errorsSignUp.batch.message}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="graduationYear">
                                                            Graduation Year
                                                        </Label>
                                                        <Input
                                                            id="graduationYear"
                                                            name="graduationYear"
                                                            type="number"
                                                            {...registerSignUp("graduationYear")}
                                                            placeholder="Enter your graduation year"
                                                        />
                                                        {errorsSignUp.graduationYear && (
                                                            <p className="text-red-500">
                                                                {errorsSignUp.graduationYear.message}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="mt-4 flex justify-end">
                                                    <Button
                                                        onClick={() => {

                                                            // ✅ Ensure values are saved before closing dialog
                                                            const name = getValues("name")
                                                            const email = getValues("email")
                                                            const studentID = getValues("studentID")
                                                            const password = getValues("password")
                                                            const gender = getValues("gender")
                                                            const userType = getValues("userType")

                                                            // Convert batch and graduation year to numbers
                                                            const batchValue = Number(getValues("batch"));
                                                            const gradYearValue = Number(getValues("graduationYear"));


                                                            if (!batchValue || !gradYearValue) {
                                                                alert("Please fill in all fields.");
                                                                return;
                                                            }

                                                            console.log("Alumni Data Saved ✅", { batchValue, gradYearValue, name, email, password, studentID, gender, userType });

                                                            setIsAlumni(false); // Close dialog
                                                        }}>
                                                        Submit
                                                    </Button>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    )}

                                    <Button className="w-full mt-6" type="submit">
                                        <LogIn className="mr-2 w-4 h-4" /> Sign Up
                                    </Button>
                                </form>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                    <CardFooter className='flex flex-col space-y-4' >
                        <div className='relative w-full'>
                            <div className='bg-black absolute inset-0 flex items-center'>
                                <span className='w-[30%] border-t border-muted-foreground'></span>
                                <div className='w-[40%] justify-center flex text-xs uppercase bg-backgound text-muted-foreground'>Or continue with</div>
                                {/* <div className='w-[40%]'></div> */}
                                <span className='w-[30%] border-t border-muted-foreground'></span>

                            </div>
                        </div>
                        <div className='w-full gap-4'>
                            <motion.div whileHover={{ scale: 1.05 }} whileTop={{ scale: 0.95 }}>
                                <Button variant='outline' className='w-full'>Google</Button>
                            </motion.div>
                        </div>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    )
}
export default page
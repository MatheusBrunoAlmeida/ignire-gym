import { VStack, Image, Center, Heading, ScrollView, useToast } from "@gluestack-ui/themed";

import BackgroundImg from "../assets/background.png"
import Logo from "../assets/logo.svg"
import { Text } from "@gluestack-ui/themed";
import { Input } from "../components/Input";
import Button from "../components/Button";
import { useNavigation } from "@react-navigation/native";
import { AuthNavigatorRoutesProps } from "../routes/auth.routes";
import { Controller, useForm } from "react-hook-form";
import { Platform } from "react-native";

import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { api } from "../service/api";
import axios from "axios";
import { AppError } from "../utils/AppError";
import { ToastMessage } from "../components/ToastMessage";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";


type FormDataProps = {
    name: string;
    email: string;
    password: string;
    password_confirm: string;
}

const signUpSchema = yup.object({
    name: yup.string().required('Informe o nome.'),
    email: yup.string().required('Informe o email.').email('E-mail inválido.'),
    password: yup.string().required('Informe a senha.').min(6, 'A senha deve ter pelo menos 6 dígitos.'),
    password_confirm: yup.string().required('Confirme a senha.').oneOf([yup.ref('password'), ""], 'A confirmação da senha não confere.')

})

export default function SignUp() {
    const navigaton = useNavigation<AuthNavigatorRoutesProps>()
    const toast = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const { signIn } = useAuth()

    const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
        resolver: yupResolver(signUpSchema)
    })

    function handleGoBack() {
        navigaton.goBack()
    }

    async function handleSignUp({ email, name, password }: FormDataProps) {
        try {
            setIsLoading(true)
            await api.post('/users', { name, email, password })

            await signIn(email, password)

        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possivel criar a conta. tente novamente mais tarde.'
            setIsLoading(false)
            return toast.show({
                placement: "top",
                render: ({ id }) => (
                    <ToastMessage
                        id={id}
                        action="error"
                        title="Erro ao criar conta"
                        description={title}
                        onClose={() => toast.close(id)}
                    />
                )
            })
        }
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
            <VStack flex={1} bg="$gray700">
                <Image
                    source={BackgroundImg}
                    w="$full"
                    h={624}
                    defaultSource={BackgroundImg}
                    alt="Pessoas treinando"
                    position="absolute"
                />

                <VStack flex={1} px="$10" pb="$16">
                    <Center my="$24">
                        <Logo />

                        <Text color="$gray100" fontSize="$sm">
                            Treine sua mente e seu corpo.
                        </Text>
                    </Center>

                    <Center gap="$2" flex={1}>
                        <Heading color="$gray100">Crie sua conta</Heading>

                        <Controller
                            control={control}
                            name="name"
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    placeholder="Nome"
                                    onChangeText={onChange}
                                    value={value}
                                    errorMessage={errors.name?.message}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="email"
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    placeholder="E-mail"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    onChangeText={onChange}
                                    value={value}
                                    errorMessage={errors.email?.message}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="password"
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    placeholder="Senha"
                                    secureTextEntry
                                    autoCapitalize="none"
                                    onChangeText={onChange}
                                    value={value}
                                    errorMessage={errors.password?.message}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="password_confirm"
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    placeholder="Confirmar a senha"
                                    secureTextEntry
                                    autoCapitalize="none"
                                    onChangeText={onChange}
                                    value={value}
                                    onSubmitEditing={handleSubmit(handleSignUp)}
                                    returnKeyType="send"
                                    errorMessage={errors.password_confirm?.message}
                                />
                            )}
                        />

                        <Button isLoading={isLoading} onPress={handleSubmit(handleSignUp)} title="Criar e acessar" />
                    </Center>

                    <Button onPress={handleGoBack} title="Voltar para login" variant="outline" mt="$12" />
                </VStack>
            </VStack>
        </ScrollView>
    )
}
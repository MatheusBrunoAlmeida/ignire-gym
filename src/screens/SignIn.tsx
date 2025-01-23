import { VStack, Image, Center, Heading, ScrollView, useToast } from "@gluestack-ui/themed";

import BackgroundImg from "../assets/background.png"
import Logo from "../assets/logo.svg"
import { Text } from "@gluestack-ui/themed";
import { Input } from "../components/Input";
import Button from "../components/Button";
import { useNavigation } from "@react-navigation/native";
import { AuthNavigatorRoutesProps } from "../routes/auth.routes";
import { useAuth } from "../hooks/useAuth";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AppError } from "../utils/AppError";
import { ToastMessage } from "../components/ToastMessage";
import { useState } from "react";

type FormData = {
    email: string;
    password: string;
}

export default function SignIn() {
    const navigator = useNavigation<AuthNavigatorRoutesProps>()
    const toast = useToast()
    const [isLoading, setIsLoding] = useState(false)

    const { signIn } = useAuth()

    const { control, handleSubmit, formState: { errors } } = useForm<FormData>({})

    function handleNewAccount() {
        navigator.navigate("signUp")
    }

    async function handleSignin(data: FormData) {
        try {
            setIsLoding(true)
            await signIn(data.email, data.password)
        } catch (error) {
            const isAppError = error instanceof AppError
            const title = isAppError ? error.message : 'Não foi possivel entrar. Tente novamente mais tarde.'

            toast.show({
                placement: "top",
                render: ({ id }) => (
                    <ToastMessage
                        id={id}
                        action="error"
                        title="Erro ao entrar"
                        description={title}
                        onClose={() => toast.close(id)}
                    />
                )
            })
            setIsLoding(false)
            return; 
        }
    }


    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
            <VStack flex={1}>
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

                    <Center gap="$2">
                        <Heading color="$gray100">Acesse a conta</Heading>

                        <Controller
                            control={control}
                            name="email"
                            rules={{
                                required: 'Digite o email.'
                            }}
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
                            rules={{
                                required: 'Digite a senha.'
                            }}
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

                        <Button isLoading={isLoading} title="Acessar" onPress={handleSubmit(handleSignin)} />
                    </Center>

                    <Center flex={1} justifyContent="flex-end" mt="$4">
                        <Text color="$gray100" fontSize="$sm" mb="$3" fontFamily="$body">Ainda não tem acesso?</Text>

                        <Button onPress={handleNewAccount} title="Criar conta" variant="outline" />
                    </Center>
                </VStack>
            </VStack>
        </ScrollView>
    )
}
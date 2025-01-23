import { Center, Heading, Text, useToast, VStack } from "@gluestack-ui/themed";
import { ScreenHeader } from "../components/ScreenHeader";
import { Alert, ScrollView, TouchableOpacity } from "react-native";
import { UserPhoto } from "../components/UserPhoto";
import { Input } from "../components/Input";
import Button from "../components/Button";

import * as ImagePicker from "expo-image-picker"
import * as FileSystem from "expo-file-system"
import { useState } from "react";
import { ToastMessage } from "../components/ToastMessage";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";

import * as yup from 'yup'
import { yupResolver } from "@hookform/resolvers/yup";

type FromDataProps = {
    name: string;
    email: string;
    password: string;
    old_password: string;
    confirm_password: string;
}

const profileSchema = yup.object({
    name: yup.string().required('Informe o nome'),
    password: yup.string().min(6, 'A senha deve ter pelo menos 6 digitos.').nonNullable().transform((value) => !!value),
    // @ts-ignore
    confirm_password: yup.string().nonNullable().transform((value) => !!value).oneOf([yup.ref('password'), null], 'A confrimação de senha não confere').when('password',{
        is: (Field: any) => Field,
        then: yup.string().nullable().required('Informe a confirmação da senha')
    }),
})

export function Profile() {
    const [userPhoto, setUserPhoto] = useState('https://github.com/matheusbrunoalmeida.png')
    const toast = useToast()
    const { user } = useAuth()
    const { control, handleSubmit, formState: { errors } } = useForm<FromDataProps>({
        defaultValues: {
            name: user.name,
            email: user.email
        },
        // @ts-ignore
        resolver: yupResolver(profileSchema)
    })

    async function handleUserPhotoSelect() {
        try {
            const photoSelected = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                aspect: [4, 4],
                allowsEditing: true
            })

            if (photoSelected.canceled) {
                return
            }

            const photoUri = photoSelected.assets[0].uri

            if (photoUri) {
                const photoInfo = (await FileSystem.getInfoAsync(photoUri)) as {
                    size: number
                }

                if (photoInfo.size && photoInfo.size / 1024 / 1024 > 5) {
                    return toast.show({
                        placement: "top",
                        render: ({ id }) => (
                            <ToastMessage
                                id={id}
                                action="error"
                                title="Imagem muito grande"
                                description="Essa imagem é muito grande, escolha uma de até 5MB."
                                onClose={() => toast.close(id)}
                            />
                        )
                    })
                }

                setUserPhoto(photoSelected.assets[0].uri)
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function handleProfileUpdate(data: FromDataProps) {

    }

    return (
        <VStack flex={1}>
            <ScreenHeader title="Perfil" />

            <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
                <Center mt="$6" px="$10">
                    <UserPhoto
                        source={{ uri: userPhoto }}
                        alt="Foto do úsuario"
                        size="xl"
                    />

                    <TouchableOpacity>
                        <Text
                            color="$green500"
                            fontFamily="$heading"
                            fontSize="$md"
                            mt="$2"
                            mb="$8"
                            onPress={handleUserPhotoSelect}
                        >
                            Alterar foto
                        </Text>
                    </TouchableOpacity>

                    <Center w="$full" gap="$4">


                        <Controller
                            control={control}
                            name="name"
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    placeholder="Nome"
                                    bg="$gray600"
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
                                    bg="$gray600"
                                    isReadOnly
                                    onChangeText={onChange}
                                    value={value}
                                />
                            )}
                        />
                    </Center>

                    <Heading
                        alignSelf="flex-start"
                        fontFamily="$heading"
                        color="$gray200"
                        fontSize="$md"
                        mt="$12"
                        mb="$2"
                    >
                        Alterar senha
                    </Heading>

                    <Center w="$full" gap="$4">
                        <Controller
                            control={control}
                            name="old_password"
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    placeholder="Senha antiga"
                                    bg="$gray600"
                                    onChangeText={onChange}
                                    value={value}
                                    secureTextEntry
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="password"
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    placeholder="Nova senha"
                                    bg="$gray600"
                                    onChangeText={onChange}
                                    value={value}
                                    secureTextEntry
                                    errorMessage={errors.password?.message}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="confirm_password"
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    placeholder="Confirme a nova senha"
                                    bg="$gray600"
                                    onChangeText={onChange}
                                    value={value}
                                    secureTextEntry
                                    errorMessage={errors.confirm_password?.message}
                                />
                            )}
                        />

                        <Button onPress={handleSubmit(handleProfileUpdate)} title="Atualizar" />
                    </Center>
                </Center>
            </ScrollView>
        </VStack>
    )
}
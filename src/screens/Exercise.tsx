import { Box, Center, Heading, HStack, Icon, Image, Text, useToast, VStack } from "@gluestack-ui/themed";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ArrowLeft } from "lucide-react-native";
import { ScrollView, TouchableOpacity } from "react-native";
import { AppNavigatorRoutesPorps } from "../routes/app.routes";

import BodySvg from "../assets/body.svg"
import SeriesSvg from '../assets/series.svg'
import RepetitionSvg from '../assets/repetitions.svg'
import Button from "../components/Button";
import { AppError } from "../utils/AppError";
import { api } from "../service/api";
import { ToastMessage } from "../components/ToastMessage";
import { useEffect, useState } from "react";
import { ExerciseDTO } from "../dtos/ExerciseDTO";
import { Loading } from "../components/Loading";

type RouteParmsProps = {
    exerciseId: string;
}

export function Exercise() {
    const [exercise, setExercise] = useState<ExerciseDTO>({} as ExerciseDTO)
    const [isLoading, setIsLoading] = useState(true)
    const [sendingRegister, setSendingRegister] = useState(false)

    const navigation = useNavigation<AppNavigatorRoutesPorps>()
    const toast = useToast()

    const routes = useRoute()

    const { exerciseId } = routes.params as RouteParmsProps

    function handleGoBack() {
        navigation.goBack()
    }

    async function fetcthExerciseDetails() {
        try {
            setIsLoading(true)
            const response = await api.get(`/exercises/${exerciseId}`)

            setExercise(response.data)
        } catch (error) {
            const isAppError = error instanceof AppError

            const title = isAppError ? error.message : 'Não foi possivel carregar os detalhes do exercisio.'

            toast.show({
                placement: "top",
                render: ({ id }) => (
                    <ToastMessage
                        id={id}
                        action="error"
                        title="Erro ao carregar detalhes"
                        description={title}
                        onClose={() => toast.close(id)}
                    />
                )
            })
        } finally {
            setIsLoading(false)
        }
    }

    async function handleExerciseHistoryRegister() {
        try {
            setSendingRegister(true)
            const response = await api.post(`/history`, { exercise_id: exerciseId })

            toast.show({
                placement: "top",
                render: ({ id }) => (
                    <ToastMessage
                        id={id}
                        action="success"
                        title="Prabens! Exercisio registrado com sucesso!"
                        onClose={() => toast.close(id)}
                    />
                )
            })

            navigation.navigate('history')
        } catch (error) {
            const isAppError = error instanceof AppError

            const title = isAppError ? error.message : 'Não foi possivel registrar o exercicio.'

            toast.show({
                placement: "top",
                render: ({ id }) => (
                    <ToastMessage
                        id={id}
                        action="error"
                        title="Erro ao registrar o exercicio"
                        description={title}
                        onClose={() => toast.close(id)}
                    />
                )
            })
        } finally {
            setSendingRegister(false)
        }
    }

    useEffect(() => {
        fetcthExerciseDetails()
    }, [exerciseId])

    return (
        <VStack flex={1}>
            <VStack px="$8" bg="$gray600" pt="$12">
                <TouchableOpacity onPress={handleGoBack}>
                    <Icon
                        as={ArrowLeft}
                        color="$green500"
                        size="xl"
                    />
                </TouchableOpacity>

                <HStack justifyContent="space-between" alignItems="center" mt="$4" pb="$8">
                    <Heading
                        color="$gray100"
                        fontFamily="$heading"
                        fontSize="$lg"
                        flexShrink={1}
                    >
                        {exercise.name}
                    </Heading>

                    <HStack alignItems="center">
                        <BodySvg />

                        <Text
                            color="$gray200"
                            ml="$1"
                            textTransform="capitalize"
                        >
                            {exercise.grupo}
                        </Text>
                    </HStack>
                </HStack>
            </VStack>
            {isLoading ? <Loading /> :
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
                    <VStack p="$8">
                        <Box rounded="$lg" mb="$3" overflow="hidden">
                            <Image
                                source={{ uri: `${api.defaults.baseURL}/exercise/demo/${exercise.demo}` }}
                                alt="Exercicio"
                                resizeMode="cover"
                                rounded="$lg"
                                w="$full"
                                h="$80"
                            />
                        </Box>

                        <Box
                            bg="$gray600"
                            rounded="$md"
                            pb="$4"
                            px="$4"
                        >
                            <HStack
                                alignItems="center"
                                justifyContent="space-around"
                                mb="$6"
                                mt="$5"
                            >
                                <HStack>
                                    <SeriesSvg />
                                    <Text color="$gray200" ml="$2">{exercise.series} séries</Text>
                                </HStack>

                                <HStack>
                                    <RepetitionSvg />
                                    <Text color="$gray200" ml="$2">{exercise.repetitions} repetições</Text>
                                </HStack>
                            </HStack>

                            <Button isLoading={sendingRegister} onPress={handleExerciseHistoryRegister} title="Marcar como realizado" />
                        </Box>
                    </VStack>
                </ScrollView>
            }
        </VStack>
    )
}
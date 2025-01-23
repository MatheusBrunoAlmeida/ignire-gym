import { Center, Heading, HStack, Text, useToast, VStack } from "@gluestack-ui/themed";
import { HomeHeader } from "../components/HomeHeader";
import { Group } from "../components/Group";
import { useCallback, useEffect, useState } from "react";
import { FlatList } from "react-native";
import { ExerciseCard } from "../components/ExerciseCard";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesPorps } from "../routes/app.routes";
import { AppError } from "../utils/AppError";
import { ToastMessage } from "../components/ToastMessage";
import { api } from "../service/api";
import { ExerciseDTO } from "../dtos/ExerciseDTO";
import { Loading } from "../components/Loading";

export function Home() {
    const [exercises, setExercises] = useState<ExerciseDTO[]>([])
    const [groups, setGroups] = useState<string[]>([])
    const [groupSelected, setGroupSelected] = useState("antebraço")
    const [isLoading, setIsLoading] = useState(true)
    const navigation = useNavigation<AppNavigatorRoutesPorps>()
    const toast = useToast()

    function handleOpenExercisesDetails(exerciseId: string) {
        navigation.navigate("exercise", { exerciseId })
    }

    async function fecthGrups() {
        try {
            setIsLoading(true)

            const response = await api.get('/groups')
            setGroups(response.data)

        } catch (error) {
            const isAppError = error instanceof AppError

            const title = isAppError ? error.message : 'Não foi possivel carregar os grupos musculares.'

            toast.show({
                placement: "top",
                render: ({ id }) => (
                    <ToastMessage
                        id={id}
                        action="error"
                        title="Erro ao carregar grupos"
                        description={title}
                        onClose={() => toast.close(id)}
                    />
                )
            })
        }
    }

    async function fetchExercisesByGroup() {
        try {
            setIsLoading(true)
            const response = await api.get(`/exercises/bygroup/${groupSelected}`)
            setExercises(response.data)

        } catch (error) {
            const isAppError = error instanceof AppError

            const title = isAppError ? error.message : 'Não foi possivel carregar os exercisios musculares.'

            toast.show({
                placement: "top",
                render: ({ id }) => (
                    <ToastMessage
                        id={id}
                        action="error"
                        title="Erro ao carregar exercicios"
                        description={title}
                        onClose={() => toast.close(id)}
                    />
                )
            })
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fecthGrups()
    }, [])

    useFocusEffect(useCallback(() => {
        fetchExercisesByGroup()
    }, [groupSelected]))

    return (
        <VStack flex={1}>
            <HomeHeader />

            <FlatList
                data={groups}
                keyExtractor={item => item}
                renderItem={({ item }) => (
                    <Group
                        name={item}
                        isActive={groupSelected === item}
                        onPress={() => setGroupSelected(item)}
                    />

                )}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 32 }}
                style={{
                    marginVertical: 40,
                    maxHeight: 44,
                    minHeight: 44
                }}
            />

            {
                isLoading ? <Loading /> :
                    <VStack px="$8">
                        <HStack justifyContent="space-between" mb="$5" alignItems="center">
                            <Heading color="$gray200" fontSize="$md">Exercicios</Heading>

                            <Text color="$gray200" fontSize="$sm" fontFamily="$body">{exercises.length}</Text>
                        </HStack>

                        <FlatList
                            data={exercises}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => (
                                <ExerciseCard data={item} onPress={() => handleOpenExercisesDetails(item.id)} />
                            )}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{
                                paddingBottom: 20
                            }}
                        />
                    </VStack>
            }
        </VStack>
    )
}
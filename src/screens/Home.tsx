import { Center, Heading, HStack, Text, VStack } from "@gluestack-ui/themed";
import { HomeHeader } from "../components/HomeHeader";
import { Group } from "../components/Group";
import { useState } from "react";
import { FlatList } from "react-native";
import { ExerciseCard } from "../components/ExerciseCard";
import { useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesPorps } from "../routes/app.routes";

export function Home() {
    const [exercises, setExercises] = useState([
        "Puxada Frontal",
        "Remada curvada",
        "Remada unilateral",
        "Levantamento terra"
    ])
    const [groups, setGroups] = useState(["Costas", "Bícepes", "Trícepes", "Ombros"])
    const [groupSelected, setGroupSelected] = useState("Costas")
    const navigation = useNavigation<AppNavigatorRoutesPorps>()

    function handleOpenExercisesDetails(){
        navigation.navigate("exercise")
    }

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

            <VStack px="$8">
                <HStack justifyContent="space-between" mb="$5" alignItems="center">
                    <Heading color="$gray200" fontSize="$md">Exercicios</Heading>

                    <Text color="$gray200" fontSize="$sm" fontFamily="$body">{exercises.length}</Text>
                </HStack>

                <FlatList
                    data={exercises}
                    keyExtractor={item => item}
                    renderItem={({ item }) => (
                        <ExerciseCard onPress={handleOpenExercisesDetails}/>
                    )}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingBottom: 20
                    }}
                />
            </VStack>
        </VStack>
    )
}
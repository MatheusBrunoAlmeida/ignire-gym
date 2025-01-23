import { Center, Text, VStack } from "@gluestack-ui/themed";
import { ScreenHeader } from "../components/ScreenHeader";
import { HistoryCard } from "../components/HistoryCard";
import { useState } from "react";
import { SectionList } from "react-native";
import { Heading } from "@gluestack-ui/themed";

export function History() {
    const [exercises, setExercises] = useState([
        {
            title: 'Dia 21 Jan 2025',
            data: ["Puxada frontal", "Remada lateral"]
        },
        {
            title: 'Dia 22 jan 2025',
            data: ["Puxada frontal"]
        }
    ])


    return (
        <VStack flex={1}>
            <ScreenHeader title="Histórico de Exercicios" />

            <SectionList
                sections={exercises}
                keyExtractor={item => item}
                renderItem={() => <HistoryCard />}
                renderSectionHeader={({ section }) => (
                    <Heading
                        color="$gray200"
                        fontSize="$md"
                        mt="$10"
                        mb="$3"
                        fontFamily="$heading"
                    >
                        {section.title}
                    </Heading>
                )}
                style={{
                    paddingHorizontal: 32
                }}
                contentContainerStyle={exercises.length === 0 && {
                    flex: 1,
                    justifyContent: 'center'
                }}
                ListEmptyComponent={() => (
                    <Text color="$gray100" textAlign="center">
                        Não há exercicios registrados ainda. {"\n"} 
                        Vamos fazer exercicios hoje?
                    </Text>
                )}
            />
        </VStack>
    )
}
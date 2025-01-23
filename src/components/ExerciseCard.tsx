import { Icon, Text } from "@gluestack-ui/themed";
import { Heading, HStack, Image, VStack } from "@gluestack-ui/themed";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { ChevronRight } from "lucide-react-native"
import { ExerciseDTO } from "../dtos/ExerciseDTO";
import { api } from "../service/api";

type Props = TouchableOpacityProps & {
    data: ExerciseDTO
}

export function ExerciseCard({ data,...rest }: Props) {
    return (
        <TouchableOpacity  {...rest}>
            <HStack bg="$gray500" alignItems="center" p="$2" pr="$4" rounded="$md" mb="$3">
                <Image
                    source={{ uri: `${api.defaults.baseURL}/exercise/thumb/${data.thumb}` }}
                    alt="Imagem do exercicio"
                    w="$16"
                    h="$16"
                    rounded="$md"
                    mr="$4"
                    resizeMode="cover"
                />

                <VStack flex={1}>
                    <Heading fontSize="$lg" color="$white" fontFamily="$heading">{data.name}</Heading>
                    <Text fontSize="$sm" color="$gray200" mt="$1" numberOfLines={2}>
                        {data.series} séries x {data.repetitions} repetições
                    </Text>
                </VStack>

                <Icon as={ChevronRight} color="$gray300"/>
            </HStack>
        </TouchableOpacity>
    )
}
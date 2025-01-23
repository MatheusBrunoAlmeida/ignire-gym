import { Icon, Text } from "@gluestack-ui/themed";
import { Heading, HStack, Image, VStack } from "@gluestack-ui/themed";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { ChevronRight } from "lucide-react-native"

type Props = TouchableOpacityProps

export function ExerciseCard({ ...rest }: Props) {
    return (
        <TouchableOpacity  {...rest}>
            <HStack bg="$gray500" alignItems="center" p="$2" pr="$4" rounded="$md" mb="$3">
                <Image
                    source={{ uri: 'https://i.pinimg.com/236x/26/a4/31/26a4312ea5c9d9ca5415cef6670f88f0.jpg' }}
                    alt="Imagem do exercicio"
                    w="$16"
                    h="$16"
                    rounded="$md"
                    mr="$4"
                    resizeMode="cover"
                />

                <VStack flex={1}>
                    <Heading fontSize="$lg" color="$white" fontFamily="$heading">Puxada frontal</Heading>
                    <Text fontSize="$sm" color="$gray200" mt="$1" numberOfLines={2}>
                        3 séries x 12 repetições
                    </Text>
                </VStack>

                <Icon as={ChevronRight} color="$gray300"/>
            </HStack>
        </TouchableOpacity>
    )
}
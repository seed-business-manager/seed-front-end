// Importação Obrigatória
import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";

// Bibliotecas
import { Entypo } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/core";
import Axios from "axios";

// Importação de Componentes
import PageTicket from "../../components/PageTicket";
import Header from "../../components/Header";

// Configurações
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";
import { Ionicons } from "@expo/vector-icons";

// Contextos
import StoreDataContexts from "../../contexts/StoreDataContexts";
import DataAcessContexts from "../../contexts/DataAcessContexts";
import ImportantDataContext from "../../contexts/ImportantDataContexts";

export default function UpdateEmployees({ route }) {
  const { id, name, wage, position, rg, identificationType } = route.params;

  const navigation = useNavigation();
  const { data } = useContext(ImportantDataContext);
  const { dispatch } = useContext(DataAcessContexts);
  const { dispatchSD } = useContext(StoreDataContexts);

  const [isSelected, setSelection] = useState(false);
  const [newName, setNewName] = useState(name);
  const [newSalary, setNewSalary] = useState(JSON.stringify(wage));
  const [newPosition, setNewPosition] = useState(position);
  const [newRG, setNewRG] = useState(JSON.stringify(rg));
  const [selectedOption, setSelectedOption] = useState(identificationType);

  const updateEmployees = async () => {
    if (
      newName == "" ||
      newSalary == "" ||
      newPosition == "" ||
      newRG == "" ||
      isNaN(newSalary) == true
    ) {
      Alert.alert(
        "Erro",
        "Nenhum campo deve estar vazio ou ter um valor inválido",
        [{ text: "OK", onPress: () => {} }]
      );
    } else {
      await Axios.post(data.IPV4 + "/employees/update", {
        id: JSON.stringify(id),
        name: newName,
        wage: newSalary,
        position: newPosition,
        rg: newRG,
        userAdmin: data.userId,
        identificationType: selectedOption,
      })
        .then((response) => {
          dispatch({ type: "FETCH_SUCCESS" });
        })
        .catch((re) => {
          console.log("Erro: " + re);
        });

      dispatchSD({
        type: "updateData",
      });
      navigation.navigate("Confirmation", {
        type: "Update",
        item: "Employee",
      });
    }
  };

  return (
    <>
      <View
        style={{
          flex: 1,
          backgroundColor: colors.white,
          zIndex: 1,
          borderTopStartRadius: 23,
          borderTopEndRadius: 23,
        }}
      >
        <Header title="Meus Funcionários" icon={true} navigate="AuthRoutes" />

        <ScrollView showsVerticalScrollIndicator={false}>
          <StatusBar translucent={true} backgroundColor={colors.gray} />

          <View style={styles.ticketTitleView}>
            <PageTicket
              title="Atualizar funcionário"
              color={colors.primaryColor}
              image="people"
            />
          </View>

          <View style={styles.employeeIdentificationView}>
            <View style={styles.employeeIdentificationOption}>
              <TouchableOpacity
                style={[
                  styles.identificationOption,
                  selectedOption === "first" ? styles.selectedStyle : {},
                  { backgroundColor: colors.red },
                ]}
                onPress={() => {
                  selectedOption === "first"
                    ? setSelectedOption("none")
                    : setSelectedOption("first");
                }}
              >
                <Ionicons name="person-outline" size={50} color="black" />
              </TouchableOpacity>
            </View>
            <View style={styles.employeeIdentificationOption}>
              <TouchableOpacity
                style={[
                  styles.identificationOption,
                  selectedOption === "second" ? styles.selectedStyle : {},
                  { backgroundColor: colors.secondaryColor },
                ]}
                onPress={() => {
                  selectedOption === "second"
                    ? setSelectedOption("none")
                    : setSelectedOption("second");
                }}
              >
                <Ionicons name="person-outline" size={50} color="black" />
              </TouchableOpacity>
            </View>
            <View style={styles.employeeIdentificationOption}>
              <TouchableOpacity
                style={[
                  styles.identificationOption,
                  selectedOption === "third" ? styles.selectedStyle : {},
                  { backgroundColor: colors.primaryColor },
                ]}
                onPress={() => {
                  selectedOption === "third"
                    ? setSelectedOption("none")
                    : setSelectedOption("third");
                }}
              >
                <Ionicons name="person-outline" size={50} color="black" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputView}>
            <View style={styles.item}>
              <Text style={styles.text}>Nome: </Text>
              <TextInput
                defaultValue={name}
                style={styles.input}
                placeholder="Insira o nome"
                onChangeText={(text) => setNewName(text)}
                maxLength={30}
              />
            </View>
            <View style={styles.item}>
              <Text style={styles.text}>Salário: </Text>
              <TextInput
                defaultValue={JSON.stringify(wage)}
                style={styles.input}
                placeholder="Insira o salário"
                keyboardType="numeric"
                onChangeText={(text) =>
                  setNewSalary(Number(text.replace(",", ".")))
                }
              />
            </View>
            <View style={styles.item}>
              <Text style={styles.text}>Função: </Text>
              <TextInput
                defaultValue={position}
                style={styles.input}
                placeholder="Insira a função"
                onChangeText={(text) => setNewPosition(text)}
                maxLength={25}
              />
            </View>

            <View style={styles.item}>
              <Text style={styles.text}>RG: </Text>
              <TextInput
                defaultValue={JSON.stringify(rg)}
                style={styles.input}
                placeholder="Insira o número do RG"
                keyboardType="numeric"
                onChangeText={(text) => setNewRG(Number(text))}
                maxLength={10}
              />
            </View>
            <View style={styles.footer}>
              <TouchableOpacity
                style={[
                  styles.saveButton,
                  { backgroundColor: "rgba(126, 217, 87, 0.87)" },
                ]}
                onPress={() => {
                  updateEmployees();
                }}
              >
                <Text style={styles.textButton}> Atualizar </Text>
                <Entypo name="check" size={25} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  //Area do Ticket da página
  ticketTitleView: {
    width: 220,
  },
  //Area de identificação
  employeeIdentificationView: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    marginVertical: 15,
  },
  //Identicação (area)
  employeeIdentificationOption: {
    height: 100,
    marginHorizontal: 15,
  },
  //Identificação
  identificationOption: {
    height: 85,
    width: 85,
    opacity: 0.7,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  //Quando selecionado
  selectedStyle: {
    borderWidth: 4,
    borderColor: colors.green,
  },
  //Formulário
  inputView: {
    paddingHorizontal: 5,
    flex: 1,
  },
  //Cada item
  item: {
    width: "100%",
    alignItems: "center",
  },
  //Titulo de cada entrada
  text: {
    width: "90%",
    marginHorizontal: 15,
    paddingVertical: 5,
    fontFamily: fonts.heading,
    fontSize: 15,
  },
  //Caixas de texto
  input: {
    color: colors.darkGray,
    width: "95%",
    height: 45,
    fontSize: 14,
    padding: 10,
    textAlign: "left",
    borderRadius: 15,
    borderColor: colors.black,
    backgroundColor: "rgba(242, 242, 242, 1)",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 5,

    marginHorizontal: 10,
  },
  //texto do botão
  textButton: {
    color: colors.white,
    fontSize: 25,
  },
  //Espaço inferior
  footer: {
    width: "100%",
    paddingHorizontal: 15,
    marginTop: 20,
  },
  //Botão de salvar
  saveButton: {
    marginTop: 10,
    marginBottom: 10,
    height: 56,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});

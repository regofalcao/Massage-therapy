import { Background, Header, Container, ServicesCard, Input } from "./styles";
import { FaPlus, FaTimes } from "react-icons/fa";
import cardImage from "../../assets/images/cardImage.svg";
import { useEffect, useState } from "react";
import { useProducts } from "../../providers/Products";
import { useAdmin } from "../../providers/Admin";
import { useAuth } from "../../providers/Auth";
import UserListInfo from "../../components/UserListInfo";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import { useUserServices } from "../../providers/Services";
import { useForm } from "react-hook-form";
import { Box, Button, Modal, Typography } from "@mui/material";
import CustomDatePicker from "../../components/CustomDatePicker";
import { Lista } from "../../components/UserListInfo/styles";

interface SearchData {
  title: string;
}

interface iProduct {
  id?: number;
  prodId?: number;
  userId: string;
  title: string;
  description: string;
  url: string;
  price: number;
  done: boolean;
  payed: boolean;
}

const DashboardAdm = () => {
  const {
    adminGetUsers,
    adminServices,
    adminGetServices,
    adminAddService,
    pickUser,
  } = useAdmin();
  const { products } = useProducts();
  const { accessToken } = useAuth();
  const [open, setOpen] = useState(false);
  const [actualProd, setActualProd] = useState<iProduct>({} as iProduct);
  const { userGetServices, userServices } = useUserServices();
  const { register, handleSubmit } = useForm<SearchData>();
  const { searchProduct } = useProducts();

  const [newDate, setNewDate] = useState<Date | null>(
    setHours(setMinutes(new Date(), 0), 9)
  );

  const handleNewDate = (novaData: Date | null) => {
    setNewDate(novaData);
  };

  const todayDate = new Date();

  const formatDate = (element: Date) => {
    switch (element.getMonth()) {
      case 0:
        return "Janeiro";
      case 1:
        return "Fevereiro";
      case 2:
        return "Março";
      case 3:
        return "Abril";
      case 4:
        return "Maio";
      case 5:
        return "Junho";
      case 6:
        return "Julho";
      case 7:
        return "Agosto";
      case 8:
        return "Setembro";
      case 9:
        return "Outubro";
      case 10:
        return "Novembro";
      case 11:
        return "Dezembro";
    }
  };

  const handleOpenModal = (item: iProduct) => {
    setOpen(true);
    setActualProd(item);
  };

  const handleAddService = () => {
    const date = newDate + "";
    const newService = { ...actualProd, date };
    adminAddService(newService, pickUser.id, accessToken);
    setOpen(false);
  };

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const handleSearch = ({ title }: SearchData) => {
    searchProduct(title, accessToken);
  };

  const incomingServices = userServices
    .filter((service) => new Date(service.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const previousServices = userServices
    .filter((service) => new Date(service.date) < new Date())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  useEffect(() => {
    adminGetUsers(accessToken);
    adminGetServices(accessToken);
    userGetServices(pickUser.id);
  }, [pickUser.id]);

  return (
    <>
      <Background>
        <Header>
          <div className="footerDesktop">
            <div className="divHeaderTitle">
              <h3> Botões </h3>
            </div>
          </div>

          <section>
            <p>
              <b>
                Hoje, {todayDate.getDate()} de {formatDate(todayDate)}
              </b>
            </p>
            <h2>Cliente: {pickUser.name}!</h2>
            <span>
              Serviços: {incomingServices.length} compromisso(s) marcados.{" "}
            </span>
          </section>
          <div>
            <img src={cardImage} alt="headerImage" />
          </div>
        </Header>
        <Container>
          <h3>Dados do usuário</h3>
          <ul>
            <>
              <Lista>
                <p>Nome: {pickUser.name} </p>
              </Lista>
              <Lista>
                <p>Número: {pickUser.contact} </p>
              </Lista>
              <Lista>
                <p>E-mail: {pickUser.email} </p>
              </Lista>
              <Lista>
                <p>CPF: {pickUser.cpf} </p>
              </Lista>
              <Lista>
                <p>ID: {pickUser.id} </p>
              </Lista>
            </>
          </ul>
          <form>
            <h3>Próximas Sessões</h3>
          </form>
          <UserListInfo services={adminServices} admin={true} />
        </Container>

        <Container>
          <h3>Histórico de Sessões</h3>
          <UserListInfo services={previousServices} admin={true} />
          <form onSubmit={handleSubmit(handleSearch)}>
            <Input
              placeholder="O que você gostaria de fazer hoje?"
              {...register("title")}
            />
            <button type="submit"></button>
          </form>
          <ul className="Services">
            {!products.length ? (
              <div>Não encontrado</div>
            ) : (
              products.map((item) => {
                return (
                  <ServicesCard key={item.id}>
                    <div>
                      <img src={item.url} alt="cardimage" />

                      <h6>{item.title}</h6>
                      <button onClick={() => handleOpenModal(item)}>
                        <FaPlus />
                      </button>
                    </div>
                  </ServicesCard>
                );
              })
            )}
          </ul>
        </Container>
      </Background>
      <Modal open={open}>
        <Box sx={style}>
          <Button
            onClick={() => setOpen(false)}
            sx={{
              backgroundColor: "white",
              color: "red",
              marginLeft: "90%",
            }}
          >
            <FaTimes />
          </Button>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {actualProd.title}
          </Typography>
          <Typography
            id="modal-modal-description"
            sx={{
              mt: 2,
              fontSize: "13px",
              color: "#706f74",
              marginBottom: "20px",
            }}
          >
            {actualProd.description}
          </Typography>
          <Typography
            sx={{
              fontSize: "13px",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            Escolha uma data e horário
          </Typography>
          <CustomDatePicker handleNewDate={handleNewDate} />
          <Box display="flex" justifyContent="center" alignItems="center">
            <Button
              sx={{
                heigth: "20px",
                width: "150px",
                backgroundColor: "#42918d",
                mt: 2,
                fontSize: "13px",
                color: "white",
                "&:hover": {
                  backgroundColor: "#367673",
                },
              }}
              onClick={() => handleAddService()}
            >
              <FaPlus /> Agendar
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default DashboardAdm;

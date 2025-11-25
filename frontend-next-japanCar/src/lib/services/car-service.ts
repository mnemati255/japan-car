import http from '../configs/axios-config';

class CarService {
  getAllCars = () => http.get('/car');
}

const carService = new CarService();
export default carService;

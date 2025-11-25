import http from '../config/axios-config';

class CarService {
  getAllCars = async () => await http.get('car');
}

export default new CarService();

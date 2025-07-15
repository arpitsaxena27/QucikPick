import {
    IconButton,
    Drawer,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";

function Cart({cart,isCartOpen,toggleCart,setCart}) {
      
      const navigate=useNavigate();
      const checkout = () => {
            navigate("/checkout");
      };
    
    const handleRemoveFromCart = (index) => {
        setCart((prevCart) => prevCart.filter((_, i) => i !== index));
  };
  return (
    <>
                      <Drawer anchor="right" open={isCartOpen} onClose={toggleCart}>
                        <div className="w-80 pt-10 md:pt-2 p-4 h-full md:h-auto bg-[#ffc221] shadow-md">
                              <div className="flex justify-between items-center mb-4">
                                    <Typography variant="h6">
                                          Shopping Cart ({cart.length})
                                    </Typography>
                                    <IconButton onClick={toggleCart}>
                                          <CloseIcon />
                                    </IconButton>
                              </div>

                              {cart.length > 0 ? (
                                    <>
                                          <List>
                                                {cart.map((item, index) => (
                                                      <ListItem key={index}>
                                                            <ListItemText
                                                                  primary={
                                                                        item.productName
                                                                  }
                                                                  secondary={`₹${item.price}`}
                                                            />
                                                            <ListItemSecondaryAction>
                                                                  <IconButton
                                                                        edge="end"
                                                                        onClick={() =>
                                                                              handleRemoveFromCart(
                                                                                    index
                                                                              )
                                                                        }
                                                                  >
                                                                        <DeleteIcon color="error" />
                                                                  </IconButton>
                                                            </ListItemSecondaryAction>
                                                      </ListItem>
                                                ))}
                                          </List>

                                          {/* Total Price Calculation */}
                                          <h3 className="text-center text-2xl font-bold text-gray-900 mt-4">
                                                Total: ₹
                                                {cart.reduce(
                                                      (acc, item) =>
                                                            acc + item.price,
                                                      0
                                                )}
                                          </h3>
                                          <button onClick={checkout} className="bg-[#0c3e7b] text-white px-3 py-2 rounded w-full mt-1">
                                                Checkout
                                          </button>
                                    </>
                              ) : (
                                    <Typography className="text-center text-gray-600">
                                          Cart is empty
                                    </Typography>
                              )}
                        </div>
                  </Drawer></>
  )
}

export default Cart
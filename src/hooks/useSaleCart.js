import { useState, useCallback, useMemo } from "react";

export function useSaleCart() {
  const [cartItems, setCartItems] = useState([]); // { menuId, menuName, price, quantitySold }

  const addItem = useCallback((menu, quantity) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.menuId === menu.id);
      if (existing) {
        return prev.map((item) =>
          item.menuId === menu.id
            ? { ...item, quantitySold: item.quantitySold + quantity }
            : item,
        );
      }
      return [
        ...prev,
        {
          menuId: menu.id,
          menuName: menu.name,
          price: menu.price,
          quantitySold: quantity,
        },
      ];
    });
  }, []);

  const removeItem = useCallback((menuId) => {
    setCartItems((prev) => prev.filter((item) => item.menuId !== menuId));
  }, []);

  const updateQuantity = useCallback((menuId, quantity) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.menuId === menuId ? { ...item, quantitySold: quantity } : item,
      ),
    );
  }, []);

  const clearCart = useCallback(() => setCartItems([]), []);

  const estimatedTotal = useMemo(
    () =>
      cartItems.reduce((sum, item) => sum + item.price * item.quantitySold, 0),
    [cartItems],
  );

  const payload = useMemo(
    () =>
      cartItems.map(({ menuId, quantitySold }) => ({ menuId, quantitySold })),
    [cartItems],
  );

  return {
    cartItems,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    estimatedTotal,
    payload,
  };
}

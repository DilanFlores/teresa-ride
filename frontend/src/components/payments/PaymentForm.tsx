import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { ArrowLeft, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import GooglePayButton from "@google-pay/button-react";
import { Reservation } from "../../types/Reservation";
import { createReservation } from "../../services/ReservationService";

interface PaymentFormProps {
  id_document: string;
  id_trip?: string;
  license_plate?: string;
  itemName: string;
  pricePerDay: number;
  onBack: () => void;
  type: "vehicle" | "trip";
  onReservationCreated?: (reservation: Reservation) => void;
  onConfirm: (
    startDate: string,
    endDate: string,
    total: number,
    paymentMethod: "paypal" | "google pay",
    transactionCode: string,
    currency: "USD" | "CRC"
  ) => Promise<void>;
  tripStartDate?: string;
  tripEndDate?: string;
}

export function PaymentForm({
  id_document,
  id_trip,
  license_plate,
  itemName,
  pricePerDay,
  type,
  onBack,
  onReservationCreated,
  tripStartDate,
  tripEndDate,
  onConfirm
}: PaymentFormProps) {
  const [startDate, setStartDate] = useState(tripStartDate || "");
  const [endDate, setEndDate] = useState(tripEndDate || "");
  const [passengers, setPassengers] = useState(1);

  const calculateTotal = () => {
    if (type === "vehicle" && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      return days > 0 ? days * pricePerDay : 0;
    } else if (type === "trip") {
      return pricePerDay * passengers;
    }
    return 0;
  };

  const totalPrice = calculateTotal();

  const handlePaymentConfirm = async (paymentMethod: "paypal" | "google pay", transactionCode: string) => {
    if (totalPrice <= 0) {
      toast.error("Por favor verifica las fechas o datos seleccionados");
      return;
    }
    await onConfirm(startDate, endDate, totalPrice, paymentMethod, transactionCode, "USD");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" /> Volver
      </Button>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detalles de la Reservación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Reservando:</p>
                <p className="text-xl font-semibold">{itemName}</p>
              </div>

              {type === "vehicle" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-date">Fecha de Inicio</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-date">Fecha de Fin</Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate || new Date().toISOString().split("T")[0]}
                    />
                  </div>
                </div>
              )}

              {type === "trip" && (
                <div className="space-y-2">
                  <Label htmlFor="passengers">Número de Pasajeros</Label>
                  <Input
                    id="passengers"
                    type="number"
                    min={1}
                    max={20}
                    value={passengers}
                    onChange={(e) => setPassengers(parseInt(e.target.value) || 1)}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" /> Métodos de Pago
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <PayPalScriptProvider options={{ clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID, currency: "USD" }}>
                {totalPrice > 0 && (
                  <PayPalButtons
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        intent: "CAPTURE",
                        purchase_units: [{ description: itemName, amount: { value: totalPrice.toFixed(2), currency_code: "USD" } }]
                      });
                    }}
                    onApprove={(data, actions) => actions.order!.capture().then(() => handlePaymentConfirm("paypal", data.orderID))}
                  />
                )}
              </PayPalScriptProvider>
              {totalPrice > 0 && (
              <GooglePayButton
                environment="TEST"
                buttonColor="black"
                buttonType="buy"
                paymentRequest={{
                  apiVersion: 2,
                  apiVersionMinor: 0,
                  allowedPaymentMethods: [{
                    type: "CARD",
                    parameters: { allowedAuthMethods: ["PAN_ONLY","CRYPTOGRAM_3DS"], allowedCardNetworks: ["VISA","MASTERCARD"] },
                    tokenizationSpecification: { type: "PAYMENT_GATEWAY", parameters: { gateway: "example", gatewayMerchantId: "exampleGatewayMerchantId" } }
                  }],
                  merchantInfo: { merchantId: "12345678901234567890", merchantName: "Pruebas en Localhost" },
                  transactionInfo: { totalPriceStatus: "FINAL", totalPrice: totalPrice.toFixed(2), currencyCode: "USD", countryCode: "US" }
                }}
                onLoadPaymentData={() => handlePaymentConfirm("google pay", `GPAY-${Date.now()}`)}
              />
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-4">
            <CardHeader><CardTitle>Resumen</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>{type === "vehicle" ? "Precio por día:" : "Precio por persona:"}</span>
                <span>${pricePerDay}</span>
              </div>
              {type === "vehicle" && startDate && endDate && (
                <div className="flex justify-between">
                  <span>Días:</span>
                  <span>{Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000*60*60*24))}</span>
                </div>
              )}
              {type === "trip" && (
                <div className="flex justify-between">
                  <span>Pasajeros:</span>
                  <span>{passengers}</span>
                </div>
              )}
              <div className="flex justify-between text-2xl text-teal-600">
                <span>Total:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

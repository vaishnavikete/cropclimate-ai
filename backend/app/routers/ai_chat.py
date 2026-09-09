from fastapi import APIRouter
from app.schemas.all_schemas import AIChatRequest, AIChatResponse

router = APIRouter(prefix="/ai", tags=["AI Farm Assistant"])

@router.post("/chat", response_model=AIChatResponse)
def farm_assistant_chat(request: AIChatRequest):
    """
    Conversational AI Farm Assistant that leverages the farm's actual analysis context
    to provide grounded, explainable, and climate-smart advisory answers.
    """
    query = request.message.lower()
    ctx = request.farm_context or {}

    crop = ctx.get("crop", ctx.get("crop_name", "your crop"))
    temp = ctx.get("temperature_c", ctx.get("temperature", 36.0))
    moisture = ctx.get("soil_moisture_pct", ctx.get("moisture", 22.0))
    stress_prob = ctx.get("stress_probability", ctx.get("stress_prob", 75.0))
    location = ctx.get("location", ctx.get("location_name", "your farm location"))

    context_used = [
        f"Crop: {crop}",
        f"Ambient Temp: {temp}°C",
        f"Soil Moisture: {moisture}%",
        f"Stress Probability: {stress_prob}%",
        f"Location: {location}"
    ]

    # Rule-based contextual grounded answers
    if any(k in query for k in ["heat", "temperature", "40", "hot", "sun"]):
        reply = (
            f"Your {crop} field is facing significant heat-stress risks due to the current/forecasted temperature ({temp}°C) "
            f"combined with low soil moisture ({moisture}%). "
            f"Prioritize irrigating in the cooler hours (early morning between 5:00 AM – 8:00 AM or late evening after 6:00 PM) "
            f"to prevent rapid evaporative loss and thermal shock to roots. "
            f"Avoid spraying foliar fertilizers or synthetic chemicals during the midday heat peak."
        )
        actions = [
            "Irrigate during early morning or late evening.",
            "Apply mulch to retain soil profile moisture.",
            "Postpone nitrogen top-dressing until heat subsides."
        ]
    elif any(k in query for k in ["water", "irrigate", "irrigation", "dry", "moisture"]):
        if moisture < 25:
            reply = (
                f"With soil moisture currently at {moisture}%, your {crop} is below its safe root-zone threshold. "
                f"We recommend scheduling irrigation within the next 12–24 hours if water is available. "
                f"Ensure uniform water distribution, especially during critical flowering or grain filling stages."
            )
            actions = ["Initiate irrigation cycle within 12-24 hours.", "Check drip emitter pressure."]
        else:
            reply = (
                f"Your current soil moisture ({moisture}%) is in an acceptable range for {crop}. "
                f"No urgent irrigation is required today. Conserve water reserves and monitor the forecast for upcoming dry spells."
            )
            actions = ["Hold off on immediate irrigation.", "Monitor 48-hour moisture trend."]
    elif any(k in query for k in ["fertilizer", "urea", "npk", "nutrient", "nitrogen"]):
        reply = (
            f"For {crop} under current ambient temperature of {temp}°C and soil moisture of {moisture}%, "
            f"avoid heavy nitrogen application during dry spells because unassimilated nitrogen can cause leaf scorch. "
            f"Always verify nutrient status with a standard laboratory Soil Health Card before applying corrective doses."
        )
        actions = ["Split nitrogen doses into multiple applications.", "Ensure adequate soil moisture before top-dressing."]
    elif any(k in query for k in ["pest", "disease", "insect", "spray", "pesticide", "aphid"]):
        reply = (
            f"Environmental conditions (temperature {temp}°C and low moisture) can encourage sucking insects like aphids or thrips on {crop}. "
            f"Begin with Integrated Pest Management (IPM): scout the undersides of leaves, erect yellow sticky traps, and consider botanical neem sprays (5ml/L). "
            f"Only if live pest counts exceed the Economic Threshold Level (ETL), consult your local agricultural extension officer for approved active ingredients."
        )
        actions = ["Deploy yellow/blue sticky cards.", "Inspect leaf undersides in random field quadrants.", "Consult local KVK for verified ETL thresholds."]
    elif any(k in query for k in ["sow", "sowing", "seed", "date", "planting"]):
        reply = (
            f"Optimal sowing for {crop} depends on stable seedbed moisture and favorable temperatures. "
            f"Avoid sowing before heavy cloudburst forecasts or during acute heatwaves. Ensure topsoil moisture is at least 25–30% before drilling seeds."
        )
        actions = ["Check 5-day precipitation outlook.", "Confirm seed germination test score >85%."]
    else:
        reply = (
            f"Based on your farm's analysis in {location} ({crop}, {temp}°C, {moisture}% soil moisture, {stress_prob}% stress risk), "
            f"the primary management focus is stabilizing root zone hydration and mitigating heat exposure. "
            f"Please follow the prioritized irrigation timeline and maintain field hygiene."
        )
        actions = ["Review Main Dashboard Risk Gauges.", "Check Smart Irrigation Recommendation."]

    disclaimer = "AI Farm Assistant provides agronomic decision support. Always cross-check advice with regional Krishi Vigyan Kendra (KVK) guidelines and physical field inspections."

    return AIChatResponse(
        reply=reply,
        context_used=context_used,
        suggested_actions=actions,
        disclaimer=disclaimer
    )

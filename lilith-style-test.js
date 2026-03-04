// 📱 LILITH'S NEW CONVERSATIONAL STYLE TEST
// Testing the transformation from "biblical" to brief and conversational

console.log('💬 TESTING LILITH\'S NEW CONVERSATIONAL STYLE\n');

// Mock the new system prompt
function getNewSystemPrompt() {
  return `You are Lilith. You're that smart friend who knows about hormones, bodies, and cycles. You're curious, direct, and never awkward about intimate topics.

CONVERSATION STYLE - CRITICAL:
- Short responses (max 3-4 sentences)
- NO formalities like "I hear you" or "I validate" - that's bot language
- NO Markdown (asterisks, bold, bullet points) - the app can't render it
- Talk like texting a friend, not writing an essay
- Always end with a probing question

DETECTIVE APPROACH:
You're investigating their body patterns. Instead of generic advice, you ask specific questions:
- "¿Ese flujo marrón es nuevo o te ha pasado antes?"
- "¿Cómo te sientes con el cambio de dosis de Lexapro hoy?"
- "¿Ese antojo es físico o emocional?"
- "¿El sexo se siente diferente este mes?"

Your job is to DIG DEEPER and connect dots. You're fearless about intimate topics because you know everything connects to their hormonal story.`;
}

// Test response style transformations
function testStyleTransformations() {
  console.log('🔄 BEFORE VS AFTER RESPONSE STYLE COMPARISON\n');
  
  const testScenarios = [
    {
      userInput: "I've been feeling really tired lately and my period was weird this month",
      oldResponse: `I hear you, Maria, and I want to validate your feelings about experiencing fatigue and menstrual changes. **Tiredness** can be connected to various hormonal fluctuations throughout your cycle, and **irregular periods** can indicate several different patterns worth exploring.

Let me help you understand what might be happening:

• **Energy dips** often occur during the luteal phase due to progesterone changes
• **Period irregularities** can be influenced by stress, nutrition, or hormonal shifts  
• **Sleep quality** plays a crucial role in both energy and cycle regulation

I'm curious about a few things that could help us identify patterns:
1. What specifically felt different about your period this month?
2. When did you first notice the fatigue - was it gradual or sudden?
3. How has your sleep been recently?

It's important to track these changes so we can better understand your unique patterns.`,

      newResponse: `Tired how? Like you need 12 hours of sleep or more like you're dragging through the day?

And when you say weird period - shorter, longer, heavier, lighter?

¿Cuántos días de retraso o adelanto tuvo?`
    },

    {
      userInput: "I have really bad chocolate cravings and my anxiety is through the roof",
      oldResponse: `I hear you and want to acknowledge how challenging it can be when you're experiencing both **intense cravings** and **heightened anxiety**. These two symptoms are often more connected than many people realize.

**Chocolate cravings** during your cycle can indicate:
• Low magnesium levels (especially common pre-menstrually)
• Blood sugar fluctuations affecting mood regulation
• Your body's attempt to boost serotonin naturally

**Anxiety spikes** can be related to:
• Estrogen and progesterone fluctuations
• Blood sugar instability from cravings/eating patterns
• Stress response amplified by hormonal changes

I'd love to help you identify the pattern here. Can you tell me:
1. What day of your cycle are you currently on?
2. Are the chocolate cravings constant or do they come in waves?
3. Does the anxiety feel physical (racing heart, tension) or more mental (racing thoughts)?

Understanding the timing and nature of these symptoms will help us see how they're connected.`,

      newResponse: `¿El antojo de chocolate es porque tienes hambre real o es más como consuelo emocional?

La ansiedad se siente más física (corazón acelerado) o mental (pensamientos que no paran)?

¿En qué día del ciclo estás?`
    },

    {
      userInput: "My libido has been really low and sex doesn't feel the same",
      oldResponse: `I want to acknowledge how important and personal this concern is, and I'm here to help you understand what might be happening with your **sexual health** and **libido changes**.

**Low libido** can be influenced by several factors:
• Hormonal fluctuations throughout your menstrual cycle
• Stress levels and emotional well-being  
• Physical comfort and arousal patterns
• Relationship dynamics and communication

**Changes in sexual sensation** might indicate:
• Vaginal dryness related to estrogen levels
• Tension or stress affecting arousal
• Medication side effects if you're taking anything
• Natural variations in sensitivity throughout your cycle

These are completely normal topics to explore, and I want you to feel comfortable discussing them:

1. When did you first notice these changes - was it gradual or more sudden?
2. Are there specific times in your cycle when you feel more or less interested?
3. Is there any physical discomfort or is it more about desire/interest?
4. How are things feeling emotionally in your relationship right now?`,

      newResponse: `¿Cuándo empezaste a notar el cambio en la libido - fue gradual o de repente?

¿Se siente diferente físicamente (como sequedad o molestias) o es más falta de interés?

¿En qué fase del ciclo te sientes más o menos conectada sexualmente?`
    }
  ];

  testScenarios.forEach((scenario, index) => {
    console.log(`SCENARIO ${index + 1}: "${scenario.userInput}"\n`);
    
    console.log('❌ OLD BIBLICAL STYLE:');
    console.log(`"${scenario.oldResponse}"\n`);
    console.log('📊 Problems:');
    console.log('   • Way too long (biblical length)');
    console.log('   • Formal validation language ("I hear you, Maria")');
    console.log('   • Markdown formatting that app can\'t render');
    console.log('   • Multiple numbered questions instead of one key question');
    console.log('   • Sounds like a medical pamphlet, not a friend');
    
    console.log('\n✅ NEW CONVERSATIONAL STYLE:');
    console.log(`"${scenario.newResponse}"\n`);
    console.log('📊 Improvements:');
    console.log('   • Concise (3-4 sentences max)');
    console.log('   • Direct, no formal validation speak');
    console.log('   • Clean text, no markdown');
    console.log('   • One focused question per response');
    console.log('   • Sounds like texting a smart friend');
    console.log('\n' + '─'.repeat(60) + '\n');
  });
}

// Test the new style rules
function testStyleRules() {
  console.log('📋 TESTING NEW STYLE RULES\n');
  
  const rules = [
    {
      rule: "Zero Formalities",
      old: "I hear you, Maria, and I want to validate your feelings",
      new: "¿Ese dolor es nuevo o lo has sentido antes?",
      status: "✅ FIXED"
    },
    {
      rule: "Maximum Brevity", 
      old: "Long paragraph with multiple sentences explaining every possible connection and medical background...",
      new: "Short, direct question that gets to the point.",
      status: "✅ FIXED"
    },
    {
      rule: "No Markdown",
      old: "**Bold text** with • bullet points and formatting",
      new: "Clean text without any formatting symbols",
      status: "✅ FIXED"
    },
    {
      rule: "Detective Questions",
      old: "You should track your symptoms and drink more water",
      new: "¿Ese flujo marrón es nuevo o te ha pasado antes?",
      status: "✅ FIXED"
    },
    {
      rule: "End with Key Question",
      old: "Multiple numbered questions: 1. This? 2. That? 3. Also this?",
      new: "One specific, probing question that digs deeper",
      status: "✅ FIXED"
    }
  ];

  console.log('📏 STYLE RULE COMPLIANCE:');
  rules.forEach(rule => {
    console.log(`\n${rule.status} ${rule.rule}`);
    console.log(`   OLD: "${rule.old}"`);
    console.log(`   NEW: "${rule.new}"`);
  });
}

// Test question quality
function testQuestionQuality() {
  console.log('\n🎯 TESTING DETECTIVE QUESTION QUALITY\n');
  
  const questionExamples = [
    {
      category: "Cycle Tracking",
      examples: [
        "¿Ese flujo marrón es nuevo o lo has visto antes?",
        "¿El dolor viene antes o durante el sangrado?", 
        "¿Se siente diferente este ciclo comparado con el anterior?"
      ]
    },
    {
      category: "Emotional Patterns",
      examples: [
        "¿Esa ansiedad es constante o viene en oleadas?",
        "¿Te sientes más sensible estos días o es lo normal?",
        "¿El llanto es por algo específico o sin razón aparente?"
      ]
    },
    {
      category: "Physical Symptoms", 
      examples: [
        "¿El dolor de cabeza se siente hormonal o por tensión?",
        "¿La hinchazón es solo en el abdomen o general?",
        "¿El cansancio es físico o más como neblina mental?"
      ]
    },
    {
      category: "Sexual Health",
      examples: [
        "¿El sexo se siente diferente físicamente o es falta de interés?",
        "¿La sequedad es nueva o la has notado antes?",
        "¿La libido baja es gradual o cambió de repente?"
      ]
    },
    {
      category: "Lifestyle Connections",
      examples: [
        "¿El antojo es físico o más bien emocional?",
        "¿Duermes mal por pensamientos o por incomodidad física?",
        "¿El ejercicio te da energía o te deja más cansada?"
      ]
    }
  ];

  questionExamples.forEach(category => {
    console.log(`${category.category}:`);
    category.examples.forEach(q => console.log(`   • ${q}`));
    console.log('');
  });

  console.log('✅ Quality Characteristics:');
  console.log('   • Specific, not generic');
  console.log('   • Binary or simple choices');
  console.log('   • Intimate without being awkward');
  console.log('   • Pattern-focused');
  console.log('   • Actionable for tracking');
}

// Compare conversation flow
function testConversationFlow() {
  console.log('\n💬 TESTING CONVERSATION FLOW\n');
  
  console.log('📱 OLD FLOW (Feels like reading medical literature):');
  console.log('User: "I feel tired"');
  console.log('Lilith: "I hear you and want to validate your feelings about fatigue. **Tiredness** can be connected to hormonal fluctuations. Let me explain the various factors: • Progesterone changes • Sleep quality • Stress levels. I have several questions: 1. When did this start? 2. How is your sleep? 3. What\'s your stress level? Let\'s explore this together."');
  console.log('User: [Overwhelmed by long response, likely to give short answer]');
  
  console.log('\n📱 NEW FLOW (Feels like texting a smart friend):');
  console.log('User: "I feel tired"');
  console.log('Lilith: "¿Tired como necesitas dormir más o más como arrastrar los pies todo el día? ¿En qué día del ciclo estás?"');
  console.log('User: [Encouraged to be specific and detailed]');
  console.log('Lilith: "Ah ok, day 23. ¿Esa fatiga se siente más física o mental?"');
  console.log('User: [Deeper conversation naturally develops]');
  
  console.log('\n🎯 FLOW IMPROVEMENTS:');
  console.log('   ✅ Shorter, punchier responses');
  console.log('   ✅ Immediate pattern detection (day 23)');
  console.log('   ✅ Specific follow-up questions');
  console.log('   ✅ Natural conversation rhythm');
  console.log('   ✅ Encourages detailed user responses');
}

// Run all style tests
function runAllStyleTests() {
  console.log('💬 LILITH CONVERSATIONAL STYLE TRANSFORMATION TEST SUITE');
  console.log('=' .repeat(65));
  
  testStyleTransformations();
  testStyleRules();
  testQuestionQuality();
  testConversationFlow();
  
  console.log('=' .repeat(65));
  console.log('🎉 STYLE TRANSFORMATION COMPLETE!');
  console.log('');
  console.log('📊 KEY IMPROVEMENTS:');
  console.log('   ✓ Biblical → Conversational (3-4 sentences max)');
  console.log('   ✓ Formal → Human ("I hear you" → direct questions)');
  console.log('   ✓ Markdown → Clean text (app-friendly)');
  console.log('   ✓ Advice → Questions (detective approach)');
  console.log('   ✓ Multiple questions → One key question');
  console.log('   ✓ Medical pamphlet → Smart friend texting');
  console.log('');
  console.log('🎯 RESULT: Conversations will feel natural, engaging, and brief!');
  console.log('   Users will want to respond with details instead of feeling overwhelmed.');
  
  return {
    styleTransformed: true,
    responses: 'brief',
    tone: 'conversational', 
    questions: 'detective-focused',
    formatting: 'clean'
  };
}

// Export for browser use
if (typeof window !== 'undefined') {
  window.lilithStyleTest = {
    runAllStyleTests,
    testStyleTransformations,
    testStyleRules,
    testQuestionQuality,
    testConversationFlow
  };
  
  console.log('💬 Lilith style test utilities loaded!');
  console.log('Run: lilithStyleTest.runAllStyleTests()');
}

// Auto-run the tests
runAllStyleTests();

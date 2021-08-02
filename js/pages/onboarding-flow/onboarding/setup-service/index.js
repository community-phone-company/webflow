$(document).ready(() => {

    const voicemailCheckStatusImage = document.getElementById("voicemail-check-status-image");
    const didSetupVoicemail = Store.local.read(Store.keys.onboardingFlow.didSetupVoicemail);
    didSetupVoicemail ? $(voicemailCheckStatusImage).show() : $(voicemailCheckStatusImage).hide();

    const callerIdCheckStatusImage = document.getElementById("caller-id-check-status-image");
    const didSetupCallerId = Store.local.read(Store.keys.onboardingFlow.didSetupCallerId);
    didSetupCallerId ? $(callerIdCheckStatusImage).show() : $(callerIdCheckStatusImage).hide();

    const didShowConfetti = Store.local.read(
        Store.keys.onboardingFlow.didShowConfetti
    );

    if (!didShowConfetti) {
        confetti({
            particleCount: 150,
            spread: 180
        });
        Store.local.write(
            Store.keys.onboardingFlow.didShowConfetti,
            true
        );
    }
});
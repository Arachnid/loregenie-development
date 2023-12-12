export const NEW_WORLD_PROMPT = `
        The user is requesting a world. Here is relevant context to the setting in which this world exists:

        Respond with a JSON object, following this template exactly, no markdown:

        ---
        - name: Name for the setting
        - description: A detailed, 2-4 paragraph description of the setting
        - imagePrompt: A description of a header image that captures the setting, written in a way that someone who has never heard of the setting could paint a picture.
        ---

      `;
